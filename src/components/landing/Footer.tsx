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
    <footer className="bg-card border-t border-border py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Zap className="text-primary-foreground fill-primary-foreground" size={20} />
              </div>
              <span className="font-black text-xl italic">UNILINGO</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The future of academic learning. Gamified, interactive, and engaging.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-black uppercase text-xs tracking-widest mb-4 text-muted-foreground">
                {title}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a 
                      href="#" 
                      className="text-foreground/70 hover:text-primary font-medium transition-colors text-sm"
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
        <div className="pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs sm:text-sm">
            © {new Date().getFullYear()} UNILINGO. All rights reserved.
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            {socials.map((social, i) => (
              <a 
                key={i}
                href={social.href}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-muted rounded-lg sm:rounded-xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
