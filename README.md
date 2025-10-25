"# Task Tracker

A modern, responsive web application for tracking time spent on various tasks with categorization, comments, and CSV export functionality.

## Features

- ✨ **Task Management**: Create, edit, and delete tasks with names, categories, and comments
- ⏱️ **Time Tracking**: Start, pause, and complete tasks with accurate time tracking
- 🏷️ **Custom Categories**: Add, edit, and delete your own categories beyond the defaults
- ✏️ **Task Editing**: Edit task names, categories, and comments after creation
- 📊 **Smart Categorization**: Organize tasks with default categories (Work, Personal, Study, Exercise, Other) or create custom ones
- 💾 **Persistent Storage**: Tasks and categories are saved in browser local storage
- 📈 **Daily Summary**: View total tasks, completed tasks, and total time spent
- 📋 **CSV Export**: Export daily task data to CSV format for external analysis
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ⌨️ **Keyboard Shortcuts**: ESC to close modals, Ctrl+S to save edits
- 🎨 **Modern UI**: Clean, professional interface with smooth animations and intuitive controls

## Usage

### Managing Categories
- **Add Category**: Enter a new category name and click "Add Category"
- **Edit Category**: Click the "✏️" button to rename any category (including default ones)
- **Delete Category**: Click the "×" button next to custom categories (default categories cannot be deleted)
- **Smart Migration**: When editing or deleting categories, existing tasks are automatically updated
- **Real-time Updates**: Category changes immediately reflect across all tasks and dropdowns

### Adding a Task
1. Fill in the task name (required)
2. Select a category from the dropdown (includes your custom categories)
3. Add optional comments
4. Click "Add Task"

### Editing Tasks
- **Edit Button**: Click "Edit" on any active task to modify its details
- **Edit Modal**: Change task name, category, or comments
- **Keyboard Shortcuts**: 
  - ESC to close the edit modal
  - Ctrl+S (or Cmd+S on Mac) to save changes
- **Real-time Updates**: Changes are saved immediately and reflected in the interface

### Time Tracking
- **Start**: Begin timing a task
- **Pause**: Temporarily stop timing (can resume later)
- **Done**: Mark task as completed
- **Edit**: Modify task details (available for active tasks)
- **Delete**: Remove a task permanently

### Exporting Data
- Click "Export Today's Tasks to CSV" to download a CSV file
- The export includes all task details, time spent, and a summary section
- Files are named with the current date: `task-tracker-YYYY-MM-DD.csv`
- Export includes your custom categories and latest task edits

## Deployment Options

### Option 1: GitHub Pages (Recommended)

1. **Create a GitHub Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/task-tracker.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)"
   - Save the settings

3. **Access Your App**:
   - Your app will be available at: `https://yourusername.github.io/task-tracker`

### Option 2: Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Web Interface**:
   - Visit [vercel.com](https://vercel.com)
   - Connect your GitHub account
   - Import your repository
   - Vercel will automatically deploy your static site

3. **Deploy via CLI**:
   ```bash
   vercel --prod
   ```

### Option 3: Netlify

1. **Drag and Drop**:
   - Visit [netlify.com](https://netlify.com)
   - Drag your project folder to the deploy area

2. **Git Integration**:
   - Connect your GitHub repository
   - Set build command to: (none - static site)
   - Set publish directory to: (root)

## Embedding in Google Sites

Once deployed, you can embed the task tracker in Google Sites:

1. **Get Your App URL**: Copy the URL from your deployment (GitHub Pages, Vercel, etc.)

2. **Embed in Google Sites**:
   - Edit your Google Sites page
   - Click "Insert" → "Embed"
   - Paste your app URL
   - Adjust the iframe size as needed (recommended: 1200x800)

3. **Alternative Method**:
   ```html
   <iframe src="https://your-app-url.com" 
           width="100%" 
           height="800px" 
           frameborder="0">
   </iframe>
   ```

## File Structure

```
task-tracker/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Browser Compatibility

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Data Storage

- Tasks are stored in browser's local storage
- Data persists between sessions on the same device/browser
- No server required - completely client-side application

## CSV Export Format

The exported CSV includes:
- Task Name
- Category
- Status
- Time Spent (HH:MM:SS format)
- Comments
- Created At
- Completed At
- Summary section with totals

## Development

To run locally:

1. **Simple HTTP Server** (Python):
   ```bash
   python -m http.server 8000
   ```

2. **Node.js HTTP Server**:
   ```bash
   npx serve .
   ```

3. **Live Server** (VS Code Extension):
   - Install "Live Server" extension
   - Right-click index.html → "Open with Live Server"

## Contributing

Feel free to fork this project and submit pull requests for improvements!

## License

This project is open source and available under the MIT License." 
