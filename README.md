Dashup Module Model
&middot;
[![Latest Github release](https://img.shields.io/github/release/dashup/module-model.svg)](https://github.com/dashup/module-model/releases/latest)
=====

A connect interface for model on [dashup](https://dashup.io).

## Contents
* [Get Started](#get-started)
* [Connect interface](#connect)

## Get Started

This model connector adds models functionality to Dashup models:

```json
{
  "url" : "https://dashup.io",
  "key" : "[dashup module key here]"
}
```

To start the connection to dashup:

`npm run start`

## Deployment

1. `docker build -t dashup/module-model .`
2. `docker run -d -v /path/to/.dashup.json:/usr/src/module/.dashup.json dashup/module-model`