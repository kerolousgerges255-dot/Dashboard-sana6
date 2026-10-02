/**
 * سكريبت لوحة الشرف — نسخة محدّثة (أول محاولة بس لكل طالب)
 * ============================================================
 * التحديث الجديد: لو الطالب حل الامتحان أكتر من مرة، بناخد بس
 * أول محاولة له (أقدم Timestamp) على حسب الإيميل بتاعه، ونتجاهل
 * أي محاولات تانية حتى لو درجتها أعلى.
 *
 * طريقة التركيب: زي القديم بالظبط —
 * Extensions → Apps Script → الصق الكود ده بدل القديم بالكامل
 * → Deploy → Manage deployments → Edit → Version: New version
 * → Deploy
 * ============================================================
 */

// درجة النجاح الكاملة (غيّرها لو مجموع درجاتك مختلف)
var FULL_SCORE = 20;

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();

  if (data.length < 2) {
    return jsonResponse({ honorRoll: [], totalSubmissions: 0, totalStudents: 0 });
  }

  var headers = data[0];
  var scoreCol = findColumn(headers, ['Score']);
  var nameCol = findColumn(headers, ['الاسم بالكامل (بالعربي)', 'الاسم بالكامل', 'الاسم']);
  var timestampCol = findColumn(headers, ['Timestamp']);
  var emailCol = findColumn(headers, ['Email Address', 'Email', 'البريد الإلكتروني']);

  // fallback لو العناوين مختلفة شوية عن المتوقع
  if (scoreCol === -1) scoreCol = 1;
  if (nameCol === -1) nameCol = 2;
  if (timestampCol === -1) timestampCol = 0;

  // خريطة: إيميل → أول محاولة بتاعته (أقدم Timestamp)
  var firstAttemptByEmail = {};
  var totalSubmissions = 0;

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var name = row[nameCol];
    if (!name) continue;

    totalSubmissions++;

    var rawTimestamp = timestampCol !== -1 ? row[timestampCol] : null;
    var ts = rawTimestamp ? new Date(rawTimestamp).getTime() : i; // fallback: ترتيب الصف نفسه

    // مفتاح التفرقة: الإيميل لو موجود، وإلا الاسم (كخط دفاع ثاني لو الإيميل مش متسجل)
    var email = emailCol !== -1 ? String(row[emailCol] || '').trim().toLowerCase() : '';
    var key = email || ('name:' + String(name).trim().toLowerCase());

    var candidate = {
      name: String(name).trim(),
      email: email,
      rawScore: row[scoreCol],
      timestamp: rawTimestamp ? new Date(rawTimestamp).toISOString() : null,
      sortTs: ts
    };

    // لو أول مرة نشوف الإيميل ده، أو المحاولة دي أقدم من اللي محفوظة، حدّثها
    if (!firstAttemptByEmail[key] || candidate.sortTs < firstAttemptByEmail[key].sortTs) {
      firstAttemptByEmail[key] = candidate;
    }
  }

  // دلوقتي نفلتر: مين من "أول المحاولات" دي جاب الدرجة الكاملة
  var honorRoll = [];
  var allKeys = Object.keys(firstAttemptByEmail);

  allKeys.forEach(function(key) {
    var attempt = firstAttemptByEmail[key];
    var scoreValue = parseScore(attempt.rawScore);
    if (scoreValue !== null && scoreValue >= FULL_SCORE) {
      honorRoll.push({
        name: attempt.name,
        timestamp: attempt.timestamp
      });
    }
  });

  // الأحدث أولاً (على حسب وقت أول محاولة)
  honorRoll.sort(function(a, b) {
    var ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    var tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return tb - ta;
  });

  return jsonResponse({
    honorRoll: honorRoll,
    totalSubmissions: totalSubmissions,   // كل محاولات التسليم (بما فيها التكرار)
    totalStudents: allKeys.length,        // عدد الطلاب الفعليين (بعد إزالة التكرار)
    updatedAt: new Date().toISOString(),
    _debug: {
      detectedColumns: {
        score: scoreCol,
        name: nameCol,
        timestamp: timestampCol,
        email: emailCol
      }
    }
  });
}

/**
 * بيدور على أول عمود موجود من قايمة أسامي محتملة
 * (Case-insensitive: مش فارقة حروف كبيرة/صغيرة، ومش فارقة مسافات زيادة)
 */
function findColumn(headers, possibleNames) {
  var normalizedHeaders = headers.map(function(h) {
    return String(h).trim().toLowerCase();
  });
  for (var i = 0; i < possibleNames.length; i++) {
    var target = possibleNames[i].trim().toLowerCase();
    var idx = normalizedHeaders.indexOf(target);
    if (idx !== -1) return idx;
  }
  return -1;
}

/**
 * بيحاول يفهم الدرجة من الخلية، سواء كانت رقم صافي (20)
 * أو نص بصيغة "20/20" أو "20 / 20"
 */
function parseScore(rawScore) {
  if (rawScore === '' || rawScore === null || rawScore === undefined) return null;

  if (typeof rawScore === 'number') return rawScore;

  var str = String(rawScore).trim();
  var match = str.match(/^(\d+)\s*\/\s*(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }

  var num = parseInt(str, 10);
  return isNaN(num) ? null : num;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
