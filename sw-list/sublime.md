# Sublime

## Setup terminal command
Create a [symlink](http://en.wikipedia.org/wiki/Symbolic_link) so that you can access sublime from terminal with command `subl`:

```sh
ln -s /Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl /usr/local/bin/subl
```

## Install packages
install sublime text **3** package control
See <https://packagecontrol.io/installation#Simple> for instructions

### Download colore sheme
Download [Soda color theme](https://github.com/buymeasoda/soda-theme#syntax-highlighting-colour-schemes), select `preference` -> `Browser Packages` from Sublime menu to open packages folder, then unzip `.tmTheme` to `users` directory.

### Restore preferences:

1. [Package Control.sublime-settings](./Package%20Control.sublime-settings)
2. [Preferences.sublime-settings](./Preferences.sublime-settings)
3.  [SublimeLinter.sublime-settings](./SublimeLinter.sublime-settings)
