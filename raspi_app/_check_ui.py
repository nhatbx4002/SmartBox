import os, glob, re

for ui in sorted(glob.glob('ui/*.ui')):
    name = os.path.basename(ui)
    with open(ui, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find keypad buttons
    for pattern, label in [(r'btnKey(\d)', 'key'), (r'btnNum(\d)', 'num')]:
        matches = re.findall(r'"(' + pattern + r')".*?<rect>\s*<x>(\d+)<\/x>\s*<y>(\d+)<\/y>\s*<width>(\d+)<\/width>\s*<height>(\d+)<\/height>', content, re.DOTALL)
        if matches:
            w, h = matches[0][3], matches[0][4]
            print(f'{name}: keypad={w}x{h}')
            break
    
    # Find back buttons
    for m in re.finditer(r'name="(btnBack[^"]*)"', content):
        nm = m.group(1)
        rect = re.search(r'name="' + nm + r'".*?<rect>\s*<x>(\d+)<\/x>\s*<y>(\d+)<\/y>\s*<width>(\d+)<\/width>\s*<height>(\d+)<\/height>', content, re.DOTALL)
        if rect:
            w, h = rect.group(3), rect.group(4)
            txt_m = re.search(r'name="' + nm + r'".*?<string>([^<]+)<\/string>', content, re.DOTALL)
            txt = txt_m.group(1).strip() if txt_m else '?'
            print(f'  back: {nm} ({txt}) = {w}x{h}')
