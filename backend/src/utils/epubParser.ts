import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'
import xml2js from 'xml2js'

interface EpubMetadata {
  title: string
  author: string
  cover: string | null
}

/**
 * 解析 EPUB 文件元数据
 * EPUB 文件本质上是一个 ZIP 压缩包，包含：
 * - META-INF/container.xml: 指向 .opf 文件
 * - .opf 文件: 包含书名、作者、封面等信息
 */
export const parseEpubMetadata = async (filePath: string): Promise<EpubMetadata> => {
  try {
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }

    const zip = new AdmZip(filePath)
    const zipEntries = zip.getEntries()

    // 1. 读取 container.xml 找到 .opf 文件路径
    const containerEntry = zipEntries.find(
      (entry) => entry.entryName === 'META-INF/container.xml'
    )

    if (!containerEntry) {
      console.warn('container.xml not found, using defaults')
      return { title: 'Unknown Title', author: 'Unknown Author', cover: null }
    }

    const containerXml = containerEntry.getData().toString('utf8')
    const containerParsed = await xml2js.parseStringPromise(containerXml)
    
    // 获取 rootfile 路径
    const rootfilePath = containerParsed?.container?.rootfiles?.[0]?.rootfile?.[0]?.$?.['full-path']
    
    if (!rootfilePath) {
      console.warn('rootfile path not found, using defaults')
      return { title: 'Unknown Title', author: 'Unknown Author', cover: null }
    }

    // 2. 读取 .opf 文件
    const opfEntry = zipEntries.find((entry) => entry.entryName === rootfilePath)
    
    if (!opfEntry) {
      console.warn('.opf file not found, using defaults')
      return { title: 'Unknown Title', author: 'Unknown Author', cover: null }
    }

    const opfXml = opfEntry.getData().toString('utf8')
    const opfParsed = await xml2js.parseStringPromise(opfXml)
    
    const metadata = opfParsed?.package?.metadata?.[0] || {}
    
    // 提取标题
    let title = 'Unknown Title'
    if (metadata['dc:title'] && metadata['dc:title'][0]) {
      title = metadata['dc:title'][0]
    }

    // 提取作者
    let author = 'Unknown Author'
    if (metadata['dc:creator'] && metadata['dc:creator'][0]) {
      author = metadata['dc:creator'][0]
    }

    // 3. 提取封面图片
    let cover: string | null = null
    
    // 方法1: 通过 meta 标签找封面 ID
    const metas = metadata.meta || []
    const coverMeta = metas.find((m: any) => m.$?.name === 'cover')
    
    if (coverMeta && coverMeta.$?.content) {
      const coverId = coverMeta.$.content
      
      // 在 manifest 中找到封面图片
      const manifest = opfParsed?.package?.manifest?.[0]?.item || []
      const coverItem = manifest.find((item: any) => item.$?.id === coverId)
      
      if (coverItem && coverItem.$?.href) {
        const coverHref = coverItem.$.href
        const opfDir = path.dirname(rootfilePath)
        const coverPath = opfDir ? `${opfDir}/${coverHref}` : coverHref
        
        const coverEntry = zipEntries.find((entry) => entry.entryName === coverPath)
        
        if (coverEntry) {
          const coverBuffer = coverEntry.getData()
          const base64 = coverBuffer.toString('base64')
          
          // 检测图片类型
          let mimeType = 'image/jpeg'
          if (coverHref.endsWith('.png')) {
            mimeType = 'image/png'
          } else if (coverHref.endsWith('.gif')) {
            mimeType = 'image/gif'
          } else if (coverHref.endsWith('.webp')) {
            mimeType = 'image/webp'
          }
          
          cover = `data:${mimeType};base64,${base64}`
        }
      }
    }

    // 方法2: 如果方法1没找到，尝试找 cover.jpg 或 cover.png
    if (!cover) {
      const possibleCoverNames = ['cover.jpg', 'cover.jpeg', 'cover.png', 'Cover.jpg', 'Cover.jpeg', 'Cover.png']
      
      for (const name of possibleCoverNames) {
        const coverEntry = zipEntries.find((entry) => 
          entry.entryName.toLowerCase().endsWith(name.toLowerCase())
        )
        
        if (coverEntry) {
          const coverBuffer = coverEntry.getData()
          const base64 = coverBuffer.toString('base64')
          
          let mimeType = 'image/jpeg'
          if (name.endsWith('.png')) {
            mimeType = 'image/png'
          }
          
          cover = `data:${mimeType};base64,${base64}`
          break
        }
      }
    }

    return {
      title,
      author,
      cover,
    }
  } catch (error) {
    console.error('Error parsing EPUB:', error)
    // 返回默认值而不是抛出错误，让上传流程继续
    return {
      title: 'Unknown Title',
      author: 'Unknown Author',
      cover: null,
    }
  }
}