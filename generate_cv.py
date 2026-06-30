import json
import codecs

with open('data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

html = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>SƠ YẾU LÝ LỊCH - NGUYỄN DUY TÂN</title>
<style>
@page {{
  size: A4;
  margin: 25mm 20mm 25mm 30mm;
}}
body {{
  margin: 0;
  padding: 0;
  font-family: "Times New Roman", Times, serif;
  font-size: 12pt;
  line-height: 1.5;
  color: #000000;
}}
.page-a4 {{
  width: 794px;
  min-height: 1123px;
  margin: 0 auto;
  padding: 40px;
  background: #ffffff;
  page-break-after: always;
}}
p {{
  text-align: justify;
  margin-top: 6pt;
  margin-bottom: 6pt;
}}
h1 {{
  font-size: 16pt;
  font-weight: bold;
  text-align: center;
  margin: 12pt 0;
  text-transform: uppercase;
}}
h2 {{
  font-size: 14pt;
  font-weight: bold;
  color: #2f5597;
  border-bottom: 2px solid #2f5597;
  padding-bottom: 4px;
  margin-top: 16pt;
  text-transform: uppercase;
}}
h3 {{
  font-size: 13pt;
  font-weight: bold;
  border-left: 4px solid #2f5597;
  padding-left: 8px;
  margin-top: 12pt;
}}
ul, ol {{
  margin-top: 6pt;
  margin-bottom: 6pt;
  padding-left: 20px;
}}
li {{
  text-align: justify;
  margin-bottom: 4pt;
}}
table {{
  border-collapse: collapse;
  margin-top: 12pt;
  margin-bottom: 12pt;
  page-break-inside: avoid;
}}
th, td {{
  border: 1px solid #000000;
  padding: 6pt 8pt;
  vertical-align: top;
}}
th {{
  font-weight: bold;
  text-align: center;
  background-color: #f2f2f2;
}}
.text-center {{ text-align: center; }}
.text-right {{ text-align: right; }}
.bold {{ font-weight: bold; }}
</style>
</head>
<body>
<div class="page-a4">
  <h1>SƠ YẾU LÝ LỊCH TRÍCH NGANG</h1>
  <p class="text-center bold" style="font-size: 14pt;">{data['hero']['namePrefix']} {data['hero']['nameHighlight']}</p>
  <p class="text-center">{data['hero']['badge']}</p>
  
  <table width="100%" style="border: none; margin-top: 0;">
    <tr>
      <td style="border: none; width: 50%;">
        <p>Sinh nhật: 21/01/1991</p>
        <p>Email: {data['contact']['email']}</p>
      </td>
      <td style="border: none; width: 50%;">
        <p>Địa chỉ: Xã Long Hải, TP. HCM</p>
        <p>SĐT: {data['contact']['phone']}</p>
      </td>
    </tr>
  </table>

  <h2>1. GIỚI THIỆU BẢN THÂN</h2>
  <p>{data['about']['description']}</p>
  
  <h3>Khối năng lực chuyên môn</h3>
  <ul>
    {''.join(f'<li><span class="bold">{c["title"]}:</span> {c["description"]}</li>' for c in data['about'].get('cards', []))}
  </ul>

  <h2>2. KINH NGHIỆM LÀM VIỆC</h2>
  {''.join(f'<h3>{e["company"]}</h3><p class="bold">{e["role"]} | {e["date"]}</p><ul>{"".join(f"<li>{t}</li>" for t in e.get("tasks", []))}</ul>' for e in data.get('experience', []))}

  <h2>3. NHÓM KỸ NĂNG CỐT LÕI</h2>
  <ul>
    {''.join(f'<li><span class="bold">{s["title"]}:</span> {", ".join(s.get("badges", []))}</li>' for s in data.get('skills', []))}
  </ul>

  <h2>4. HỌC VẤN VÀ CHỨNG CHỈ</h2>
  <table width="100%">
    <tr>
      <th width="50%">Học vấn chính quy</th>
      <th width="50%">Chứng chỉ chuyên môn</th>
    </tr>
    <tr>
      <td>
        <p class="bold">{data['education']['degree']}</p>
        <p>{data['education']['school']}</p>
        <p>{data['education']['years']}</p>
      </td>
      <td>
        <ul>
          {''.join(f'<li>{c["title"]} ({c["year"]})</li>' for c in data.get('certifications', []))}
        </ul>
      </td>
    </tr>
  </table>

  <h2>5. CÁC DỰ ÁN NỔI BẬT</h2>
  <table width="100%">
    <tr>
      <th width="30%">Tên dự án</th>
      <th width="70%">Mô tả chi tiết</th>
    </tr>
    {''.join(f'<tr><td class="bold">{p["title"]}</td><td><p><span class="bold">{p["role"]}</span></p><p>{p["description"]}</p></td></tr>' for p in data.get('portfolio', []))}
  </table>

</div>
</body>
</html>'''

# Clean up tags and emojis
html = html.replace('<strong>', '<span class="bold">').replace('</strong>', '</span>')
for emoji in ['🌐 ', '🖥️ ', '🛠️ ', '📅 ', '🤝 ', '🎂 ', '📧 ', '📍 ', '📞 ']:
    html = html.replace(emoji, '')

with codecs.open('CV_Nguyen_Duy_Tan.html', 'w', 'utf-8') as f:
    f.write(html)
