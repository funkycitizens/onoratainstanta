This is the source for the [Onorată Instanță](http://onoratainstanta.ro)
website.

## How to build
The site is rendered using [Jekyll](http://jekyllrb.com/). This happens
automatically because the site is hosted with [GitHub
Pages](https://pages.github.com/).

To render the site locally, install Jekyll, and run the build. The `--watch`
flag will re-generate the site if any file is modified. You can see the output
in the `_site` directory.

```shell
jekyll build --watch
```

### Data
The leaf pages (for each "instanță" and "parchet") are pre-generated from CSV
files. The code is inside the `_build` folder, and you can run it, should you
want to update the CSV data, or change the templates for the leaf pages.

The scripts in `_data` run on node.js, here's how to run them:

```shell
cd _bulid
npm install
./node_modules/.bin/gulp data
```
