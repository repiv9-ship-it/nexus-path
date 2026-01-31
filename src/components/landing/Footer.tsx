import { Zap, Twitter, Github, Linkedin, Youtube } from 'lucide-react';

export function Footer() {
  const links = {
    company: ['About', 'Careers', 'Press'],
    resources: ['Help Center', 'Blog', 'Developers'],
    legal: ['Terms', 'Privacy', 'Cookies'],
  };

  const socials = [
    { icon: Twitter, href: '#' },
    { icon: Github, href: '#' },
    { icon: Linkedin, href: '#' },
    { icon: Youtube, href: '#' },
  ];

  return (
    <footer className="bg-sidebar text-sidebar-foreground py-16 px-6 border-t border-sidebar-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Zap className="text-primary-foreground fill-primary-foreground" size={20} />
              </div>
              <span className="font-black text-xl italic">UNILINGO</span>
            </div>
            <p className="text-sidebar-muted text-sm leading-relaxed">
              The future of academic learning. Gamified, interactive, and engaging.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-black uppercase text-xs tracking-widest mb-4 text-sidebar-muted">
                {title}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a 
                      href="#" 
                      className="text-sidebar-foreground/70 hover:text-primary font-medium transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-sidebar-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sidebar-muted text-sm">
            © 2024 UNILINGO. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socials.map((social, i) => (
              <a 
                key={i}
                href={social.href}
                className="w-10 h-10 bg-sidebar-accent rounded-xl flex items-center justify-center text-sidebar-muted hover:text-primary hover:bg-primary/10 transition-all"
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
