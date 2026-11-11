import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Lưu dữ liệu vào file JSON trong backend/data/ (thư mục này nằm trong .gitignore).
// Đủ dùng cho bài tập, không cần cài database.
const DATA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../data')

/**
 * Tạo kho dữ liệu lưu trong file backend/data/<name>.json
 * @param {string} name tên file, ví dụ 'users'
 * @param {any} initial giá trị ban đầu khi file chưa có
 */
export function createJsonStore(name, initial) {
  const file = path.join(DATA_DIR, `${name}.json`)
  // Hàng đợi: các lần ghi chạy lần lượt để 2 request cùng lúc không ghi đè mất dữ liệu của nhau
  let queue = Promise.resolve()

  async function read() {
    try {
      return JSON.parse(await readFile(file, 'utf8'))
    } catch (err) {
      if (err.code === 'ENOENT') return structuredClone(initial)
      throw err
    }
  }

  /** Đọc dữ liệu, cho hàm `change` sửa rồi ghi lại. Trả về kết quả của `change`. */
  function update(change) {
    const task = queue.then(async () => {
      const data = await read()
      const result = await change(data)
      await mkdir(DATA_DIR, { recursive: true })
      // Ghi ra file tạm rồi đổi tên, tránh hỏng file nếu server tắt giữa chừng
      await writeFile(`${file}.tmp`, JSON.stringify(data, null, 2))
      await rename(`${file}.tmp`, file)
      return result
    })
    queue = task.catch(() => {})
    return task
  }

  return { read, update }
}
