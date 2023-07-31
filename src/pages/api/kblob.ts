'use server'

import { NextApiRequest, NextApiResponse } from 'next'
import { fetch } from '@/lib/isomorphic'
import { KBlobRequest } from '@/lib/bots/bing/types'
import FormData from 'form-data'

// const API_DOMAIN = 'https://www.bing.com'
const API_DOMAIN = 'https://bing.vcanbb.top'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { knowledgeRequest, imageBase64 } = req.body as KBlobRequest
    const formData = new FormData()
    formData.append('knowledgeRequest', JSON.stringify(knowledgeRequest))
    if (imageBase64) {
      formData.append('imageBase64', imageBase64)
    }

    const response = await fetch(`${API_DOMAIN}/images/kblob`,
      {
        method: 'POST',
        body: formData.getBuffer(),
        headers: {
          "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "Referer": `${API_DOMAIN}/web/index.html`,
          "Referrer-Policy": "origin-when-cross-origin",
          ...formData.getHeaders()
        }
      }
    ).then(res => res.text())

    res.writeHead(200, {
      'Content-Type': 'application/json',
    })
    res.end(response || JSON.stringify({ result: { value: 'UploadFailed', message: '请更换 IP 或代理后重试' } }))
  } catch (e) {
    return res.json({
      result: {
        value: 'UploadFailed',
        message: `${e}`
      }
    })
  }
}
