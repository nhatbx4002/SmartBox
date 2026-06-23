import os

def fix_keypad_block(content, prefix):
    idx = 0
    while True:
        start = content.find(f'name="{prefix}', idx)
        if start == -1:
            break
        geom_start = content.find('<rect>', start)
        geom_end = content.find('</rect>', geom_start) + len('</rect>')
        block = content[geom_start:geom_end]
        
        if '<width>100</width>' in block and '<height>80</height>' in block:
            new_block = block.replace('<width>100</width>', '<width>110</width>')
            new_block = new_block.replace('<height>80</height>', '<height>88</height>')
            content = content[:geom_start] + new_block + content[geom_end:]
            idx = geom_start + len(new_block)
        else:
            idx = start + 1
    return content

def fix_ui(ui_path):
    with open(ui_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    for prefix in ['btnKey','btnNum','btnBackspace','btnClear']:
        content = fix_keypad_block(content, prefix)
    
    for old_btn in ['btnBack','btnBackMain']:
        idx = content.find(f'name="{old_btn}"')
        if idx == -1:
            continue
        
        geom_start = content.find('<rect>', idx)
        geom_end = content.find('</rect>', geom_start) + len('</rect>')
        block = content[geom_start:geom_end]
        
        lines = block.split('\n')
        x_val = '32'
        for line in lines:
            s = line.strip()
            if s.startswith('<x>'):
                x_val = s[3:-4]
                break
        
        new_block = f'    <rect>\n      <x>{x_val}</x>\n      <y>32</y>\n      <width>170</width>\n      <height>62</height>\n     </rect>'
        content = content[:geom_start] + new_block + content[geom_end:]
        
        style_start = content.find('font-size:', idx)
        if style_start != -1 and style_start < content.find('</property>', idx):
            style_end = content.find(';', style_start)
            old_fs = content[style_start:style_end]
            for size in ['14px','15px','16px','17px','18px','19px']:
                if size in old_fs and size != '20px':
                    content = content[:style_start] + 'font-size: 20px' + content[style_end:]
                    break
    
    if content != original:
        with open(ui_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

files = [
    'OTPInput.ui', 'PhoneNumberInput.ui', 'RentSizeSelection.ui',
    'RentPlan.ui', 'RentPlanOptions.ui', 'Payment.ui',
    'PickupMethod.ui', 'QRScan.ui', 'Support.ui',
]

for f in files:
    path = os.path.join('ui', f)
    if fix_ui(path):
        print(f'{f}: fixed')
    else:
        print(f'{f}: no changes')

print('Done')
