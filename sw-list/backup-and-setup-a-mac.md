# Backup and setup a Mac
## Backup Mac
1. Backup ~/ folder
2. Backup QQ chat log: ~/Library/Containers/com.tencent.qq/Data/Library/Application Support/QQ/[your qq number]
3. Backup alfred:
    1. backup alfred settings `alfred preferences → advanced → syncing:reveal in finder -> backup Alfred.alfredpreferences`
    2. backup license 
    3. Deactive alfred


## Setup
1. [Revoke China Certs](https://github.com/chengr28/RevokeChinaCerts)
2. install software from Mac app store and [Mac Software list](./mac.md)
3. restore alfred, active alfred and restore `Alfred.alfredpreferences`
4. restore qq chatlog, put backupped folder where it is
5. restore [sulime preferences](sublime.md)
6. install [hombrew](http://brew.sh/) and [brew cask](https://github.com/caskroom/homebrew-cask)
7. install Node via homebrew: `brew install node`, then [common npm packages](npm.md)
8. install [quicklook plugins](https://github.com/sindresorhus/quick-look-plugins)
