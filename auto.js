const fs = require('fs-extra')
const YAML = require('json-to-pretty-yaml')
const path = require('path')
const docs = require('./data.json')

const PAGES = ['marketing', 'brand', 'communication', 'channel']

function getIndexYaml(data) {
  const pageIndex = YAML.stringify({
    layout: 'home',
    pageClass: 'home',
    footer: false,
    hero: {
      name: '互联网专业词汇',
      tagline: 'Internet Bullshit Words',
    },
    features: data.map((n, i) => ({
      title: n.cat,
      link: `/pages/${PAGES[i]}.html`,
      icon: {
        src: `/icons/${PAGES[i]}.svg`,
        width: 40,
        height: 40,
      },
      details: n.des,
    })),
  })

  return ['---', pageIndex, '---'].join('\n')
}

function getSubPages(data) {
  return data
    .map(n => {
      const subContent = n.list
        .map(n => {
          return [`## ${n.word}`, n.explain, '::: tip 举例', `${n.examp.map(n => '- ' + n).join('\n')}`, ':::'].join('\n')
        })
        .join('\n')

      return [`# ${n.cat}`, n.des, subContent].join('\n')
    })
    .map((n, i) => ({
      path: `./pages/${PAGES[i]}`,
      content: n,
    }))
}

getSubPages(docs.data).forEach(p => {
  const tPath = path.join('docs', `${p.path}.md`)
  fs.removeSync(tPath)
  fs.ensureFileSync(tPath)
  fs.writeFileSync(tPath, p.content)
})

fs.writeFileSync('./docs/index.md', getIndexYaml(docs.data))
