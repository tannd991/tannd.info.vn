import json
import codecs

with open('data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

html = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>CV - NGUYỄN DUY TÂN</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }}
  body {{
    background: #555;
    display: flex;
    justify-content: center;
    padding: 40px;
    font-family: 'Montserrat', sans-serif;
  }}
  .page {{
    width: 794px;
    height: 1123px;
    background: #fff;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    display: flex;
    overflow: hidden;
    position: relative;
  }}
  .left-col {{
    width: 35%;
    background: #e2e1df;
    height: 100%;
    padding: 0 30px;
    position: relative;
    z-index: 2;
  }}
  .right-col {{
    width: 65%;
    background: #fff;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
  }}
  .header-bg {{
    background: #6e6761;
    height: 240px;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }}
  .header-content {{
    position: relative;
    z-index: 2;
    height: 240px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px 40px 20px 40px;
    color: #fff;
  }}
  .name {{
    font-size: 38px;
    font-weight: 800;
    letter-spacing: 2px;
    line-height: 1.1;
    text-transform: uppercase;
  }}
  .job-title {{
    font-size: 14px;
    font-weight: 600;
    margin-top: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #e2e1df;
  }}
  .right-body {{
    padding: 40px;
    position: relative;
    z-index: 2;
    flex: 1;
  }}
  
  .avatar-arch {{
    width: 100%;
    height: 300px;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 0 0 120px 120px;
  }}
  
  .left-content {{
    margin-top: 310px;
    position: relative;
    z-index: 4;
  }}
  
  .avatar-img {{
    width: 190px;
    height: 190px;
    border-radius: 50%;
    object-fit: cover;
    background: #ccc;
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    border: 8px solid #fff;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    z-index: 5;
  }}

  /* Sections */
  .section-title {{
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 2px;
    color: #333;
    margin-bottom: 15px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
  }}
  .section-title::after {{
    content: '';
    flex: 1;
    height: 1px;
    background: #6e6761;
    margin-left: 15px;
  }}
  .left-col .section-title::after {{
    background: #999;
  }}
  
  /* Left Text */
  .left-col h4 {{
    font-size: 11px;
    font-weight: 700;
    color: #333;
    margin-top: 15px;
  }}
  .left-col p {{
    font-size: 10px;
    color: #555;
    line-height: 1.5;
    margin-bottom: 5px;
  }}
  .left-col ul {{
    list-style-type: disc;
    padding-left: 15px;
    margin-bottom: 20px;
  }}
  .left-col li {{
    font-size: 10px;
    color: #555;
    line-height: 1.6;
    margin-bottom: 4px;
  }}
  .contact-item {{
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 10px;
    color: #333;
    margin-bottom: 10px;
    font-weight: 600;
  }}
  
  /* Right Text */
  .profile-text {{
    font-size: 11px;
    color: #555;
    line-height: 1.6;
    text-align: justify;
    margin-bottom: 30px;
  }}
  
  .exp-item {{
    position: relative;
    padding-left: 20px;
    margin-bottom: 20px;
  }}
  .exp-item::before {{
    content: '';
    position: absolute;
    left: 0;
    top: 5px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid #6e6761;
    background: #fff;
    z-index: 2;
  }}
  .exp-line {{
    position: absolute;
    left: 4px;
    top: 15px;
    bottom: -15px;
    width: 2px;
    background: #6e6761;
    z-index: 1;
  }}
  .exp-item:last-child .exp-line {{
    display: none;
  }}
  
  .exp-header {{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }}
  .exp-role {{
    font-size: 12px;
    font-weight: 700;
    color: #333;
    text-transform: uppercase;
  }}
  .exp-company {{
    font-size: 11px;
    font-weight: 700;
    color: #666;
    margin-bottom: 5px;
    text-transform: uppercase;
  }}
  .exp-date {{
    font-size: 10px;
    color: #666;
    font-weight: 600;
  }}
  .exp-desc {{
    font-size: 10px;
    color: #555;
    line-height: 1.5;
  }}
  .exp-desc ul {{
    padding-left: 15px;
  }}
  
  .achieve-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }}
  .achieve-item h4 {{
    font-size: 11px;
    font-weight: 700;
    color: #333;
    margin-bottom: 5px;
  }}
  .achieve-item p {{
    font-size: 10px;
    color: #555;
    line-height: 1.5;
  }}

</style>
</head>
<body>

<div class="page">
  
  <div class="left-col">
    <!-- Note: in Canva the arch is at the top left, which is actually a large white rectangle that curves at the bottom! 
         Or rather, a grey column that curves at the top. Let's look closely: 
         The top part of left column is white. The grey background starts below the avatar in an arch shape.
         Let's just use a white background that extends down and rounds at the bottom. -->
    <div class="avatar-arch"></div>
    <img src="avatar_centered.jpg" class="avatar-img" alt="Avatar">
    
    <div class="left-content">
      <div class="section-title">EDUCATION</div>
      <h4>{data['education']['years']}</h4>
      <p style="font-weight:700;">{data['education']['degree'].upper()}</p>
      <p>{data['education']['school'].upper()}</p>
      <br>
      
      <div class="section-title">SKILLS</div>
      <ul>
        <li>Networking & Security (Cisco, Fortinet)</li>
        <li>System Admin (Windows Server, AD)</li>
        <li>Cloud (Google Workspace, M365, Azure)</li>
        <li>IT Helpdesk & Troubleshooting</li>
        <li>IT Asset Management</li>
        <li>AI Automation & Chatbots</li>
      </ul>
      <br>
      
      <div class="section-title">CERTIFICATES</div>
      <ul>
        {''.join(f'<li>{c["title"]}</li>' for c in data.get('certifications', []))}
      </ul>
      <br>
      
      <div class="section-title">CONTACT</div>
      <div class="contact-item">📞 {data['contact']['phone']}</div>
      <div class="contact-item">✉️ {data['contact']['email']}</div>
      <div class="contact-item">📍 Xã Long Hải, TP. HCM</div>
      <div class="contact-item">🌐 tannd.info.vn</div>
    </div>
  </div>
  
  <div class="right-col">
    <div class="header-bg"></div>
    <div class="header-content">
      <div class="name">{data['hero']['namePrefix']} <br>{data['hero']['nameHighlight']}</div>
      <div class="job-title">IT Helpdesk & Network<br>System Administrator</div>
    </div>
    
    <div class="right-body">
      <div class="section-title">PROFILE INFO</div>
      <div class="profile-text">{data['about']['description']}</div>
      
      <div class="section-title">EXPERIENCE</div>
      {''.join(f"""
      <div class="exp-item">
        <div class="exp-line"></div>
        <div class="exp-header">
          <div>
            <div class="exp-role">{e['role']}</div>
            <div class="exp-company">{e['company']}</div>
          </div>
          <div class="exp-date">{e['date']}</div>
        </div>
        <div class="exp-desc">
          <ul>
            {''.join(f"<li>{t}</li>" for t in e.get('tasks', [])[:3])}
          </ul>
        </div>
      </div>
      """ for e in data.get('experience', []))}
      
      <div class="section-title">ACHIEVEMENT</div>
      <div class="achieve-grid">
        {''.join(f"""
        <div class="achieve-item">
          <h4>{p['title']}</h4>
          <p>{p['description']}</p>
        </div>
        """ for p in data.get('portfolio', [])[:2])}
      </div>
    </div>
  </div>
  
</div>

</body>
</html>'''

# Clean up tags
html = html.replace('<strong>', '<b>').replace('</strong>', '</b>')
for emoji in ['🌐 ', '🖥️ ', '🛠️ ', '📅 ', '🤝 ', '🎂 ', '📧 ', '📍 ', '📞 ']:
    html = html.replace(emoji, '')

with codecs.open('CV_Canva_Style.html', 'w', 'utf-8') as f:
    f.write(html)
