// 简单的 EPUB 元数据提取函数
export const parseEpubMetadata = async (filePath: string): Promise<any> => {
  try {
    // 对于现在，我们返回默认的元数据
    // 完整的 EPUB 解析可以在后续添加
    return {
      title: 'Unknown Title',
      author: 'Unknown Author',
      cover: null,
    }
  } catch (error) {
    console.error('Error parsing EPUB:', error)
    throw error
  }
}
