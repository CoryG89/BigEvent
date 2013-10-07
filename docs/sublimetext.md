Guide for Sublime Text
======================
I recommend using [Sublime Text 3][sublime-text-3] and the command line in lieu
of a full fledged IDE for both client and server side coding.

Options
-------
Options in Sublime Text are handled via JSON files. You can view the default
system wide options by selecting from the top menu 
`Preferences --> Settings - Default`. These options are the default global
options and are not language specific. It is not recommended to edit this file
as it is meant to be used as a reference for the defaults. 

Instead you may use the menu to select `Preferences --> Settings - User`. This
will open an empty JSON file in which you may add options from the default
settings file. Any options in the user settings file will overwrite the option
from the default settings file.

Here is my current custom settings for Sublime Text 3:

    {
        "color_scheme": "Packages/Theme - Phoenix/Color Scheme/Phoenix Dark Blue.tmTheme",
        "ensure_newline_at_eof_on_save": true,
        "font_size": 10,
        "ignored_packages":
        [
            "Vintage"
        ],
        "margin": 0,
        "rulers":
        [
            0,
            80
        ],
        "shift_tab_unindent": true,
        "translate_tabs_to_spaces": true,
        "word_wrap": true
    }

As I stated above, these options are language-independent. In order to set
different options depending on what language you're doing you will need to open
from the top menu `Preferences --> Settings - More --> Syntax Specific - User`.
This will open a JSON file used to set options that will overwrite the system
wide settings for the particular syntax of the file that's active.

For example, the `tab_size` setting is set to 4 by default. Let's say that for
JSON I do not want such a large tab size and would rather have it at 2. I can
make sure that my current syntax is JSON in the bottom right corner of the
Sublime Text window and then open `Syntax Specific - User`. If you haven't set
any JSON specific settings previously it should open an empty JSON document.
You can set the tab size to be 2 for JSON by saving the following:

    {
        "tab_size": 2
    }

This will change `tab_size` to 2 only for the JSON syntax.

Package Control
---------------
Sublime Text has a package manager which allows you to install add-ons for the
editor. Package Control is not included with Sublime Text by default, but I
highly recommend it as there are many useful add-ons which can make development
within Sublime Text much more enjoyable and productive. Some examples of
packages that I am using are.

   - **JSHint Gutter** - Runs JSHint on JavaScript files whenever a file is
       saved. JSHint warns you about common JavaScript pitfalls that would
       normally go unnoticed. JavaScript, in my opinion, is a fantastic language
       However, it does contain many gotchas and concepts that are somewhat
       misleading for developers coming from more traditional languages such as
       Java, C/C++. JSHint is highly configurable with `.jshintrc` files which
       is a JSON file.

   - **jQuery** - Adds autocompletion, snippets, etc for jQuery.

   - **Smart Markdown** - Markdown syntax highlighting, preview, rendering, etc.

#### Installation

You can install Package Control easily by opening the console by selecting from
the top menu `View --> Show Console` and copying/entering the following text

>import urllib.request,os; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); open(os.path.join(ipp, pf), 'wb').write(urllib.request.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ','%20')).read())

#### Installing Packages

I would *definitely* recommend installing JSHint Gutter. JSHint can save you a
lot of time by catching mistakes for you, as well as keeping our code uniformly
formatted in the process. Once you have Package Control installed, install
JSHint Gutter by selecting from the upper menu `Preferences -> Package Control`
and typing or clicking `Install Package`. Search for `jshint` in order to find
and select JSHint Gutter. After it installs you'll need to configure it by
selecting from the menu:

    Preferences -> Package Settings -> JSHint Gutter -> Set Plugin Options

Set it to lint on save. If you get lots of errors in lots of the project files
you may need to copy the contents of the `.jshintrc` file into the settings
file found at:

    Preferences -> Package Settings -> JSHint Gutter -> Set Linting Options


[sublime-text-3]: http://sublimetext.com/3
