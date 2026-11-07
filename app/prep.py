# 붕어빵 앱 준비: 'npx cap add android' 다음에 실행해요 (GitHub Actions가 알아서 돌려요)
#  - 앱 아이콘(동그란/네모/적응형)과 시작 화면을 img/icon-512.png로 만들어요
#  - AdMob 앱 ID, 버전 번호, 세로 화면 고정을 넣어요
# 사용: python3 prep.py <아이콘 png> <android 폴더>
import os, re, sys, json
from PIL import Image, ImageDraw, ImageFilter

SRC, AND = sys.argv[1], sys.argv[2]
RES = os.path.join(AND, 'app/src/main/res')
BG = '#FFC46B'
ico = Image.open(SRC).convert('RGBA')


def _grad():
    """아이콘 배경과 같은 빛: 가운데 연노랑 → 가장자리 주황 (256×256 한 번 만들어 늘려 써요)"""
    C = [(0, (255, 233, 168)), (.5, (255, 204, 104)), (.72, (255, 170, 72)), (1, (255, 160, 64))]
    g = Image.new('RGB', (256, 256)); px = []
    for y in range(256):
        for x in range(256):
            d = min(1, ((x - 127.5) ** 2 + (y - 127.5) ** 2) ** .5 / 181)
            for i in range(len(C) - 1):
                if d <= C[i + 1][0]:
                    t = (d - C[i][0]) / (C[i + 1][0] - C[i][0]); a, b = C[i][1], C[i + 1][1]
                    px.append(tuple(round(a[j] + (b[j] - a[j]) * t) for j in range(3))); break
    g.putdata(px)
    return g.filter(ImageFilter.GaussianBlur(3))


GR = _grad()


def backdrop(w, h):
    s = max(w, h)
    b = GR.resize((s, s), Image.BICUBIC).convert('RGBA')
    l, t = (s - w) // 2, (s - h) // 2
    return b.crop((l, t, l + w, t + h))


def placed(w, h, k):
    """배경 위에 아이콘을 가운데(짧은 변의 k배)로, 가장자리는 부드럽게"""
    out = backdrop(w, h)
    n = int(min(w, h) * k)
    im = ico.resize((n, n), Image.LANCZOS)
    m = Image.new('L', (n, n), 0)
    f = max(2, n // 24)
    ImageDraw.Draw(m).rounded_rectangle((f, f, n - f, n - f), radius=n // 6, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(f))
    out.paste(im, ((w - n) // 2, (h - n) // 2), m)
    return out


D = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}
for d, k in D.items():
    p = os.path.join(RES, 'mipmap-' + d)
    os.makedirs(p, exist_ok=True)
    s = round(48 * k)
    sq = ico.resize((s, s), Image.LANCZOS)
    m = Image.new('L', (s, s), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, s - 1, s - 1), radius=s // 6, fill=255)
    a = Image.new('RGBA', (s, s), (0, 0, 0, 0)); a.paste(sq, (0, 0), m)
    a.save(os.path.join(p, 'ic_launcher.png'))
    m = Image.new('L', (s, s), 0)
    ImageDraw.Draw(m).ellipse((0, 0, s - 1, s - 1), fill=255)
    r = Image.new('RGBA', (s, s), (0, 0, 0, 0)); r.paste(sq, (0, 0), m)
    r.save(os.path.join(p, 'ic_launcher_round.png'))
    f = round(108 * k)
    # 적응형 아이콘: 보이는 곳은 가운데 2/3 동그라미 → 아이콘을 0.8배로 넣어 귀·꼬리가 안 잘리게
    placed(f, f, .8).save(os.path.join(p, 'ic_launcher_foreground.png'))

with open(os.path.join(RES, 'values/ic_launcher_background.xml'), 'w') as fp:
    fp.write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">%s</color>\n</resources>\n' % BG)

# 시작 화면 (원래 크기 그대로 바꿔요)
n = 0
for root, _, files in os.walk(RES):
    for fn in files:
        if fn == 'splash.png':
            fp = os.path.join(root, fn)
            w, h = Image.open(fp).size
            placed(w, h, .42).convert('RGB').save(fp)
            n += 1
print('아이콘·시작 화면 완료 (시작 화면 %d개)' % n)

# AndroidManifest: AdMob 앱 ID + 세로 화면
ADMOB = os.environ.get('ADMOB_APP_ID') or 'ca-app-pub-3940256099942544~3347511713'  # 🧪 구글 시험용
mf = os.path.join(AND, 'app/src/main/AndroidManifest.xml')
s = open(mf, encoding='utf-8').read()
if 'gms.ads.APPLICATION_ID' not in s:
    s = s.replace('</application>', '    <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="%s"/>\n    </application>' % ADMOB, 1)
if 'screenOrientation' not in s:
    s = s.replace('android:name=".MainActivity"', 'android:name=".MainActivity"\n            android:screenOrientation="portrait"', 1)
open(mf, 'w', encoding='utf-8').write(s)
assert 'gms.ads.APPLICATION_ID' in s and 'screenOrientation' in s
print('AdMob 앱 ID:', ADMOB)

# 버전: 이름은 package.json, 번호는 빌드할 때마다 1씩 (GitHub 실행 번호)
ver = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'package.json')))['version']
code = int(os.environ.get('GITHUB_RUN_NUMBER') or 1)
bg = os.path.join(AND, 'app/build.gradle')
s = open(bg, encoding='utf-8').read()
s, a = re.subn(r'versionCode \d+', 'versionCode %d' % code, s)
s, b = re.subn(r'versionName "[^"]*"', 'versionName "%s"' % ver, s)
assert a == 1 and b == 1, '버전 줄을 못 찾았어요'
open(bg, 'w', encoding='utf-8').write(s)
print('버전:', ver, '(번호 %d)' % code)
