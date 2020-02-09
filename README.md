# Gulp 4 Template
[Gulp](https://gulpjs.com/) is a Java Script based task runner build tool, which can automate the common task while building an application. It allows you to do a lot of stuff within your development workflow. There are lot of tasks which were taking lot of time of UI developers and affect their productivity. Gulp is a tool that helps you out with several tasks when it comes to web development. It's often used to do front end tasks like:
- Move files to another location (ex from project folders to Web folder)
- Spinning up a web server
- Reloading the browser automatically whenever a file is saved
- Using preprocessors like Sass or LESS
- Optimizing assets like CSS, JavaScript, and images
- Combine files (concatenate) into another file

**Gulp 4 Templae makes it easy to set your own custom tasks, turn features on and off**, without having to modify gulp tasks.
## Geting started
---
### Installing Gulp
To be able to use this template you need to have:
- [Node.js (Node) installed onto your computer](https://nodejs.org/en/download/)
- [Gulp Command Line Utility](https://gulpjs.com/docs/en/getting-started/quick-start)
### Quick Start
1. Clone this repository to your computer.
2. In bash/terminal/command line, `cd` into cloned project.
3. Run `npm install` to install required dependencies.
4. After installation is done, run one of task runners to start developing:
    - `gulp` which will serve files and wathc for changes
    - `gulp build` which will minimize all files and send them in dist folder

**Test this template.** After running `gulp` task, you can change any file inside src folder and see them recompile automatilly. Also you can put inside project your own files, but you need to pay attention to maintan folder structure.
## Documentation
---
> All assigned tasks can be checked by typing `gulp --tasks` in command line
### HTML
Put your HTML files i root of `src/` directory. When you run `gulp` task HTML files will stay as-is and gulp will watch every time you made change in file.

When you run `gulp dist` task HTML files will be minified and copied to dist directory. If you want to minifie only HTML files you can also run `gulp html` task.


