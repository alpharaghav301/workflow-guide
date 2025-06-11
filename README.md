# N8N Workflow Presentation Viewer

A beautiful, interactive React/TypeScript presentation viewer for n8n workflow management training and documentation.

## 🚀 Live Demo

[View Live Presentation](https://your-username.github.io/your-repo-name)

## ✨ Features

**🎯 Interactive Navigation**
- Next/Previous buttons with keyboard support
- Slide thumbnails sidebar with drag-to-reorder
- Direct slide jumping and auto-play functionality
- Mobile-responsive design

**✏️ Full Editing Capabilities**
- Real-time slide editing with live preview
- Add, delete, and reorder slides
- Customizable link labels and formatting
- Import/export presentations as JSON

**🎨 Professional Design**
- Modern gradient backgrounds and glass morphism
- Consistent typography and color schemes
- Smooth animations and transitions
- Code syntax highlighting

**📊 Comprehensive Content**
- 15 slides covering n8n workflow best practices
- Trigger types and management strategies
- Installation and deployment guidelines
- Security and review processes

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful SVG icons
- **React Hooks** - Modern state management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### Navigation
- **Mouse**: Use Next/Previous buttons or click slide thumbnails
- **Keyboard**: 
  - Arrow keys for navigation
  - Spacebar for next slide
  - Escape to stop auto-play
- **Auto-play**: Click the play button in the header

### Editing Mode
1. Click the **Edit button** (pencil icon) in the header
2. **Edit slides**: Click the edit button on any slide
3. **Add slides**: Use the + button to insert new slides
4. **Reorder slides**: Hover over slides and use up/down arrows
5. **Customize links**: Use the link button to modify link labels
6. **Export/Import**: Save your work or load existing presentations

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Deploy automatically on every push

### Deploy to GitHub Pages

1. **Configure for your repository**
   - Edit `next.config.js`
   - Uncomment and update the basePath lines with your repo name

2. **Build and deploy**
   ```bash
   npm run deploy
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag the `out` folder to [netlify.com/drop](https://netlify.com/drop)
   - Or connect your GitHub repo for automatic deployments

## 🎨 Customization

### Adding New Slides
1. Enter edit mode and click the + button
2. Or modify `src/data/presentationData.ts` directly
3. Follow the existing slide structure

### Styling Changes
- Modify Tailwind classes in `src/components/PresentationViewer.tsx`
- Update color schemes in the component
- Adjust typography and spacing as needed

### Link Customization
- Use the link editor in edit mode
- Or programmatically update the `customLinkLabels` state
- Links are automatically detected and made clickable

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # App layout and metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   └── PresentationViewer.tsx  # Main presentation component
├── data/
│   └── presentationData.ts     # Slide content and structure
└── types/
    └── presentation.ts          # TypeScript interfaces
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **n8n** for the excellent workflow automation platform
- **Next.js team** for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set

## 📞 Support

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/your-repo-name/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/your-repo-name/discussions)

---

Built with ❤️ by [Your Name](https://github.com/your-username)
