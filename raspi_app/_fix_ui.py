import re, os

def fix_keypad(ui_path, key_width=110, key_height=88):
    with open(ui_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    for name in ['btnKey0','btnKey1','btnKey2','btnKey3','btnKey4','btnKey5',
                 'btnKey6','btnKey7','btnKey8','btnKey9','btnNum1']:
        pattern = re.compile(
            r'(name="' + name + r'".*?<rect>\s*<x>)(\d+)(</x>\s*<y>)(\d+)(</y>\s*<width>)\d+(</width>\s*<height>)\d+(</height>)',
            re.DOTALL
        )
        m = pattern.search(content)
        if m:
            x, y = int(m.group(2)), int(m.group(4))
            new_x = x - 5
            content = pattern.sub(
                r'\g<1>' + str(new_x) + r'\g<3>' + str(y) + r'\g<5>' + str(key_width) + r'\g<7>' + str(key_height),
                content
            )
    
    for name in ['btnBackspace', 'btnClear']:
        pattern = re.compile(
            r'(name="' + name + r'".*?<rect>\s*<x>)(\d+)(</x>\s*<y>)(\d+)(</y>\s*<width>)\d+(</width>\s*<height>)\d+(</height>)',
            re.DOTALL
        )
        m = pattern.search(content)
        if m:
            x, y = int(m.group(2)), int(m.group(4))
            new_x = x - 5
            content = pattern.sub(
                r'\g<1>' + str(new_x) + r'\g<3>' + str(y) + r'\g<5>' + str(key_width) + r'\g<7>' + str(key_height),
                content
            )
    
    if content != original:
        with open(ui_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def fix_back_button(ui_path, width=170, height=62, font_size=20):
    with open(ui_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    for name in ['btnBack', 'btnBackMain']:
        pattern = re.compile(
            r'(name="' + name + r'".*?<rect>\s*<x>)(\d+)(</x>\s*<y>)(\d+)(</y>\s*<width>)\d+(</width>\s*<height>)\d+(</height>)',
            re.DOTALL
        )
        m = pattern.search(content)
        if m:
            x, y = int(m.group(2)), int(m.group(4))
            content = pattern.sub(
                r'\g<1>' + str(x) + r'\g<3>32\g<5>' + str(width) + r'\g<7>' + str(height),
                content
            )
    
    content = re.sub(
        r'(QPushButton#btnBack[^{]*\{[^}]*font-size: )\d+(px;)',
        r'\g<1>' + str(font_size) + r'\g<2>',
        content
    )
    content = re.sub(
        r'(#btnBackMain[^{]*\{[^}]*font-size: )\d+(px;)',
        r'\g<1>' + str(font_size) + r'\g<2>',
        content
    )
    
    if content != original:
        with open(ui_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

files = [
    ('OTPInput.ui', True, True),
    ('PhoneNumberInput.ui', True, True),
    ('RentSizeSelection.ui', False, True),
    ('RentPlan.ui', False, True),
    ('RentPlanOptions.ui', False, True),
    ('Payment.ui', False, True),
    ('PickupMethod.ui', False, True),
    ('QRScan.ui', False, True),
    ('Support.ui', False, True),
]

for ui_name, fix_key, fix_back in files:
    ui_path = os.path.join('ui', ui_name)
    if not os.path.exists(ui_path):
        print(f'{ui_name}: NOT FOUND')
        continue
    changes = []
    if fix_key and fix_keypad(ui_path):
        changes.append('keypad 110x88')
    if fix_back and fix_back_button(ui_path):
        changes.append('back 170x62 f20')
    if changes:
        print(f'{ui_name}: {" + ".join(changes)}')
    else:
        print(f'{ui_name}: no changes')

print('Done')
