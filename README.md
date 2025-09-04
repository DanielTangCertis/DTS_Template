# ABOUT THIS TEMPLATE

## ABOUT THIS BRANCH

This branch is in an additional working directory linked to the original Vue3Template repo, this was achieved using `git worktree`. Can `git bash` directly from here, and note that this branch is checked out at the same time while master is checked out in the original repo.

> [!INFO]
> BEFORE RUNNING, ENSURE THE HOST CONFIGURATION IN **public>aircity>ac_conf.js** is correct.

## Project Structure

- `node_modules` -- *All project dependency packages are placed in this directory.*
- `public`
    - `aircity` --- *JS files for connecting to the video stream and configuration items (ac.min.js, ac_conf.js, userinfo.js)*
- `src` -- *Source files directory*
    - `assets` -- *Directory for placing static files*
    - `components` -- *Vue component files; custom components are all placed here.*
        - `animation` -- *Navigation module*
        - `header` -- *Top navigation bar*
        - `layerTree` -- *Layer tree*
        - `player` -- *Video stream*
        - `weather` -- *Time and weather*
        - `routerNav` -- *Route navigation*
    - `router` -- *Vue Router configuration files*
    - `store` -- *State manager*
    - `views` -- *Page files*
    - `App.vue` -- *Root component*
    - `main.js` -- *Entry point*
- `.gitignore`
- `package.json`

## Others

**DTS Online Docs：**[https://doc.freedo3d.com/](https://doc.freedo3d.com/)

**API Docs**[http://sdk.g-bim.cn/doc/api/index.html](http://sdk.g-bim.cn/doc/api/index.html) -- Same as the API reference contained in the DTS Cloud installation 
