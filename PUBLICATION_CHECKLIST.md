# Pre-Publication Checklist

Before publishing this package to npm/VS Code Marketplace, complete these steps:

## Required Updates

### 1. Update Package Information

- [ ] Edit `package.json`:
  - Replace `"author": "Your Name <your.email@example.com>"` with your actual name and email
  - Update repository URLs:
    - Replace `https://github.com/yourusername/parallels-mcp-server.git`
    - Replace `https://github.com/yourusername/parallels-mcp-server#readme`
    - Replace `https://github.com/yourusername/parallels-mcp-server/issues`

### 2. Update License

- [ ] Edit `LICENSE`:
  - Replace `[Your Name]` with your actual name

### 3. Update Contributing Guide

- [ ] Edit `CONTRIBUTING.md`:
  - Update repository URL in development setup section

### 4. Test the Package

- [ ] Build successfully: `npm run build`
- [ ] Test locally with: `npm link`
- [ ] Test with Claude Desktop or another MCP client
- [ ] Verify all tools work correctly

### 5. Version Control

- [ ] Initialize git repository: `git init`
- [ ] Add all files: `git add .`
- [ ] Commit: `git commit -m "Initial commit"`
- [ ] Create GitHub repository
- [ ] Push: `git remote add origin <your-repo-url> && git push -u origin main`

### 6. npm Publication

- [ ] Ensure you're logged in: `npm login`
- [ ] Check package contents: `npm pack --dry-run`
- [ ] Publish: `npm publish`

### 7. Post-Publication

- [ ] Create a GitHub release/tag
- [ ] Update any documentation
- [ ] Share with the community!

## Testing Commands

```bash
# Build the package
npm run build

# Run locally
npm start

# Test in development mode
npm run dev

# Check what will be published
npm pack --dry-run

# Link for local testing
npm link

# In another project, test with:
npm link parallels-mcp-server
```

## Notes

- The package is restricted to macOS only (`"os": ["darwin"]`)
- Requires Node.js 16 or higher
- Requires Parallels Desktop to be installed
- All source code has been cleaned and generalized
- Input validation is in place using Zod
- Error handling has been improved
- Documentation is comprehensive

## What's Included

✅ Clean, generalized source code  
✅ TypeScript with proper types  
✅ Input validation with Zod  
✅ Comprehensive error handling  
✅ MIT License  
✅ README with full documentation  
✅ CONTRIBUTING guidelines  
✅ CHANGELOG  
✅ .npmignore for clean package  
✅ .gitignore  
✅ Proper package.json configuration  
✅ Build scripts and automation

## Ready to Publish!

Once you've completed the checklist above, your package is ready for publication! 🚀
