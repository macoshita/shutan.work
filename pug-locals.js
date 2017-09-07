let data = {
  title: 'SHU∞TAN',
  url: 'https://shutan.work/',
  image: 'https://shutan.work/img/header.jpg',
description: '「あかりひょうたん」のお店SHU∞TAN。ひょうたんで作ったライトやランプシェードなどを紹介しています。'
}

data.schema = {
  '@context': 'http://schema.org',
  '@type': 'WebSite',
  name: data.title,
  url: data.url,
  image: data.image,
  description: data.description
}

module.exports = data