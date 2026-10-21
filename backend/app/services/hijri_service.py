import math
from datetime import datetime, timezone

HIJRI_MONTHS = [
    {"en": "Muharram", "ar": "محرّم", "ur": "محرم الحرام"},
    {"en": "Safar", "ar": "صفر", "ur": "صفر المظفر"},
    {"en": "Rabi' al-Awwal", "ar": "ربيع الأول", "ur": "ربیع الاول"},
    {"en": "Rabi' al-Thani", "ar": "ربيع الثاني", "ur": "ربیع الثانی"},
    {"en": "Jumada al-Ula", "ar": "جمادى الأولى", "ur": "جمادی الاول"},
    {"en": "Jumada al-Akhirah", "ar": "جمادى الآخرة", "ur": "جمادی الثانی"},
    {"en": "Rajab", "ar": "رجب", "ur": "رجب المرجب"},
    {"en": "Sha'ban", "ar": "شعبان", "ur": "شعبان المعظم"},
    {"en": "Ramadan", "ar": "رمضان", "ur": "رمضان المبارک"},
    {"en": "Shawwal", "ar": "شوّال", "ur": "شوال المکرم"},
    {"en": "Dhu al-Qi'dah", "ar": "ذو القعدة", "ur": "ذی القعدہ"},
    {"en": "Dhu al-Hijjah", "ar": "ذو الحجة", "ur": "ذی الحجہ"},
]

def gregorian_to_hijri(date: datetime = None) -> dict:
    """
    Standard astronomical Kuwaiti / civil Islamic calendar conversion algorithm.
    Converts Gregorian date to Hijri date with documented regional lunar caveat.
    """
    if date is None:
        date = datetime.now(timezone.utc)

    day = date.day
    month = date.month
    year = date.year

    if month < 3:
        year -= 1
        month += 12

    a = math.floor(year / 100)
    b = 2 - a + math.floor(a / 4)

    if year < 1583:
        b = 0
    if year == 1582:
        if month > 10:
            b = -10
        if month == 10:
            b = 0
            if day > 4:
                b = -10

    jd = math.floor(365.25 * (year + 4716)) + math.floor(30.6001 * (month + 1)) + day + b - 1524

    b = 0
    if jd > 2299160:
        a = math.floor((jd - 1867216.25) / 36524.25)
        b = 1 + a - math.floor(a / 4)
    bb = jd + b + 1524
    cc = math.floor((bb - 122.1) / 365.25)
    dd = math.floor(365.25 * cc)
    ee = math.floor((bb - dd) / 30.6001)
    day = (bb - dd) - math.floor(30.6001 * ee)
    month = ee - 1
    if ee > 13:
        cc += 1
        month = ee - 13
    year = cc - 4716

    i_jd = jd - 1948440 + 10632
    n = math.floor((i_jd - 1) / 10631)
    i_jd = i_jd - 10631 * n + 354
    j = (math.floor((10985 - i_jd) / 5316)) * (math.floor((50 * i_jd) / 17719)) + (math.floor(i_jd / 5670)) * (math.floor((43 * i_jd) / 15238))
    i_jd = i_jd - (math.floor((30 - j) / 15)) * (math.floor((17719 * j) / 50)) - (math.floor(j / 16)) * (math.floor((15238 * j) / 43)) + 29
    m = math.floor((24 * i_jd) / 709)
    d = i_jd - math.floor((709 * m) / 24)
    y = 30 * n + j - 30

    # Ensure index within 0-11
    month_idx = max(0, min(11, m - 1))
    month_meta = HIJRI_MONTHS[month_idx]

    return {
        "hijri_day": int(d),
        "hijri_month": int(m),
        "hijri_month_name_en": month_meta["en"],
        "hijri_month_name_ar": month_meta["ar"],
        "hijri_month_name_ur": month_meta["ur"],
        "hijri_year": int(y),
        "gregorian_date": date.strftime("%Y-%m-%d"),
        "formatted_en": f"{int(d)} {month_meta['en']} {int(y)} AH",
        "formatted_ur": f"{int(d)} {month_meta['ur']} {int(y)} ھ",
        "formatted_ar": f"{int(d)} {month_meta['ar']} {int(y)} هـ",
        "calculation_method": "Civil Islamic Calendar (Standard Kuwaiti Algorithm)",
        "disclaimer": "Calculated Hijri dates may differ by 1-2 days based on verified regional crescent moon sightings."
    }
