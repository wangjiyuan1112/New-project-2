import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import KineticGrid from './components/KineticGrid';

const portfolio = {
  name: '王吉源',
  role: '游戏特效师',
  contact: '男 | 年龄：27 岁 | 136****7919 | 8***@qq.com',
  portfolioUrl: 'https://www.magesbox.com/member/18722',
  avatar: '/assets/wang-jiyuan-portrait.jpg',
  personalAdvantages: [
    '熟练使用 3Dmax，PS，Houdini，AE 等设计软件制作特效素材',
    '熟练使用虚幻 Niagara,Unity3d 引擎制作 2d，3d 特效',
    '熟悉特效制作流程，有特效性能优化经验',
    '能独立制作特效所需的效果材质',
    '了解 AIGC，能熟练通过 AI 制作特效所需的资产文件，提高制作效率',
    '具有手绘设计稿的能力，并通过 AI 生成特效设计稿',
  ],
  experience: [
    {
      period: '2024.11-至今',
      company: 'SNK 中国',
      role: '3D 特效师',
      duties: [
        '制作角色局内的技能，大招特效，场景的氛围特效以及关卡内的功能性特效',
        '制作小怪和 Boss 的技能特效，并对项目内特效进行性能优化',
        '培养新人熟悉项目特效风格和制作规范',
        '探索更符合项目的特效风格',
      ],
    },
    {
      period: '2023.06-2024.11',
      company: '完美世界',
      role: '3D 特效',
      duties: [
        '制作角色局内的 HighLight 镜头表演特效，战斗的技能特效',
        '制作剧情所需的过场特效，以及审核和反馈外包的特效资源',
        '培养新人熟悉项目特效风格和制作规范',
        '在还原原作特效的基础上优化特效的品质',
      ],
    },
    {
      period: '2021.08-2023.05',
      company: '盖娅互娱',
      role: '游戏特效',
      duties: [
        '制作局内的角色技能，演出特效',
        '制作局内 Boss 和小怪的技能特效',
        '场景特效以及交互类特效制作',
      ],
    },
    {
      period: '2020.07-2021.08',
      company: '蓝鲸时代',
      role: '游戏特效师',
      duties: [
        '根据策划内容设计制作人物 场景特效',
        '根据策划内容设计制作 ui 界面特效和动效',
        '审核以及反馈外包的特效文件',
      ],
    },
  ],
  projectExperience: [
    'PJN(拳皇 IP 的横板 3D 格斗类）',
    'PJW(原创 IP 的 3D 动作类）',
    '女神异闻录 夜幕魅影(p5x)',
    '山海异闻录 妖错图',
    '镇魂街 武神躯手游',
  ],
  education: '中南林业科技大学 本科 产品设计 2016-2020',
  projects: [
    { id: '01', date: '2026.02.02', type: '作品展示', title: '2026.02.02', meta: '原始 MP4 · 保持画面比例', video: '/assets/videos/2026.2.2.mp4', className: 'project--wide' },
    { id: '02', date: '2024.05.09', type: '作品展示', title: '2024.05.09', meta: '原始 MP4 · 保持画面比例', video: '/assets/videos/2024.5.9.mp4', className: 'project--wide' },
    { id: '03', date: '2024.03.01', type: '作品展示', title: '2024.03.01', meta: '原始 MP4 · 保持画面比例', video: '/assets/videos/2024.3.1.mp4', className: 'project--wide' },
    { id: '04', date: '2023.12.16', type: '作品展示', title: '2023.12.16', meta: '原始 MP4 · 保持画面比例', video: '/assets/videos/2023.12.16.mp4', className: 'project--wide' },
    { id: '05', date: '2023.10.09', type: '作品展示', title: '2023.10.09', meta: '原始 MP4 · 保持画面比例', video: '/assets/videos/2023.10.09.mp4', className: 'project--wide' },
    { id: '06', date: '2023.03.25', type: '作品展示', title: '2023.03.25', meta: '原始 MP4 · 保持画面比例', video: '/assets/videos/2023.3.25.mp4', className: 'project--wide' },
    { id: '07', date: '2023.02.26', type: '作品展示', title: '2023.02.26', meta: '原始 MP4 · 保持画面比例', video: '/assets/videos/2023.2.26-perfect-world-test.mp4', className: 'project--wide' },
    { id: '08', date: '2023.01.09', type: '作品展示', title: '2023.01.09', meta: '原始 MP4 · 保持画面比例', video: '/assets/videos/2023.1.9.mp4', className: 'project--wide' },
    { id: '09', date: '2022.08.01', type: '作品展示', title: '2022.08.01', meta: '原始 MP4 · 保持画面比例', video: '/assets/videos/2022.8.1.mp4', className: 'project--wide' },
  ],
};

function ArrowIcon() {
  return <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h13M10 3l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>;
}

function Mark() {
  return <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>;
}

function MenuIcon() {
  return <span className="menu-icon" aria-hidden="true"><i /><i /></span>;
}

function ExternalLink({ className = '', children, ...props }) {
  return <a className={className} href={portfolio.portfolioUrl} target="_blank" rel="noreferrer" {...props}>{children}</a>;
}

function VideoPreview({ project }) {
  const playPreview = (event) => {
    const video = event.currentTarget;
    video.muted = true;
    video.play().catch(() => {});
  };

  const resetPreview = (event) => {
    const video = event.currentTarget;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <video className="project-video" preload="metadata" muted loop playsInline tabIndex={0}
      onMouseEnter={playPreview} onMouseLeave={resetPreview}
      onFocus={playPreview} onBlur={resetPreview}
      aria-label={`${project.title} 原始 MP4 预览`}>
      <source src={project.video} type="video/mp4" />
    </video>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-frame">
      <KineticGrid />
      <main className="site-content">
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <a href="#top" className="brand" onClick={closeMenu} aria-label="返回顶部"><Mark /><span>{portfolio.name}</span></a>
        <nav className={menuOpen ? 'is-open' : ''} aria-label="主导航">
          <a href="#about" onClick={closeMenu}>关于我 <em>01</em></a>
          <a href="#work" onClick={closeMenu}>精选项目 <em>02</em></a>
          <a href="#projects" onClick={closeMenu}>项目经历 <em>03</em></a>
        </nav>
        <a className="header-contact" href="#contact">联系合作 <ArrowIcon /></a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="切换导航" aria-expanded={menuOpen}><MenuIcon /></button>
      </header>

      <section id="top" className="hero hero--graphic section-shell">
        <div className="hero-media" aria-hidden="true">
          <video autoPlay muted loop playsInline poster="/assets/hero-art.svg">
            <source src="https://cdn.coverr.co/videos/coverr-a-blue-nebula-in-space-1573/1080p.mp4" type="video/mp4" />
          </video>
          <div className="hero-grid" />
          <div className="hero-vignette" />
        </div>
        <img className="hero-graphic-system" src="/assets/hero-graphic-system.svg" alt="" aria-hidden="true" />
        <div className="hero-graphic-meta" aria-hidden="true"><span>VFX / REALTIME / MOTION</span><span>01—2026</span><span>GAME EFFECTS</span></div>
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> {portfolio.role}</p>
          <p className="hero-pretitle">作品集网站：</p>
          <h1>让冲击，<br /><span>被看见。</span></h1>
          <div className="hero-foot">
            <p>{portfolio.contact}</p>
            <a href="#work" className="round-link" aria-label="查看作品"><span>查看作品</span><ArrowIcon /></a>
          </div>
        </div>
        <div className="hero-index" aria-label="继续滚动"><span>SCROLL TO EXPLORE</span><i /></div>
        <div className="hero-coordinate">WANG JIYUAN&nbsp;&nbsp;/&nbsp;&nbsp;VFX ARCHIVE</div>
      </section>

      <section id="about" className="about section-shell content-section">
        <div className="section-kicker"><span>01</span><p>ABOUT / PROFILE</p></div>
        <div className="about-layout">
          <div className="about-portrait-wrap">
            <div className="portrait-index">[ PROFILE ]</div>
            <img src={portfolio.avatar} className="portrait" alt="王吉源个人主页的抽象人物视觉" />
            <div className="portrait-glass"><span>{portfolio.role}</span><strong>{portfolio.name}</strong></div>
          </div>
          <div className="about-content">
            <p className="about-lead"><strong>{portfolio.role}</strong></p>
            <ul className="about-advantage-list" aria-label="个人优势">
              {portfolio.personalAdvantages.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <div className="about-contact-grid">
              <ExternalLink><span>作品集网站：</span><strong>{portfolio.portfolioUrl}</strong><ArrowIcon /></ExternalLink>
              <div><span>{portfolio.contact}</span><strong>中南林业科技大学 本科 产品设计 2016-2020</strong></div>
            </div>
          </div>
        </div>
        <div className="experience-list" aria-label="工作经历">
          <div className="experience-heading"><span>工作经历</span></div>
          {portfolio.experience.map((item) => <article className="experience-item" key={`${item.period}-${item.company}`}>
            <p>{item.period}</p>
            <div>
              <h3>{item.company}<span>{item.role}</span></h3>
              <div className="experience-duties">{item.duties.map((duty) => <p key={duty}>{duty}</p>)}</div>
            </div>
          </article>)}
        </div>

      </section>

      <section id="work" className="work section-shell content-section">
        <div className="section-head">
          <div className="section-kicker"><span>02</span><p>SELECTED WORK</p></div>
          
        </div>
        <div className="work-grid">
          {portfolio.projects.map((project) => <article className={`project-card project-card--clean ${project.className}`} key={project.id}>
            <VideoPreview project={project} />
          </article>)}
        </div>
      </section>

      <section id="projects" className="resume-project-experience section-shell content-section">
        <div className="section-head">
          <div className="section-kicker"><span>03</span><p>项目经历</p></div>
          <p className="project-experience-note">项目经历</p>
        </div>
        <div className="project-experience-grid" aria-label="项目经历">
          {portfolio.projectExperience.map((project, index) => <article className="project-experience-card" key={project}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h2>{project}</h2>
            <i aria-hidden="true" />
          </article>)}
        </div>
      </section>

      <section id="contact" className="contact-end section-shell">
        <div className="contact-stars" aria-hidden="true" />
        <div className="contact-top"><span>04</span><p>作品集网站：</p><span>© 2026</span></div>
        <div className="contact-main">
          <p>{portfolio.name}<br />{portfolio.role}</p>
          <ExternalLink className="contact-email">{portfolio.portfolioUrl} <ArrowIcon /></ExternalLink>
          <p className="contact-detail">{portfolio.contact}</p>
        </div>
        <footer><div><ExternalLink>作品集网站：</ExternalLink><a href="#top">BACK TO TOP ↑</a></div><p>{portfolio.education}</p></footer>
      </section>
    </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);










