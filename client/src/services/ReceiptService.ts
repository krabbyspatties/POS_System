import AxiosInstance from "../AxiosInstance"

const ReceiptService = {
  saveReceipt: async (formData: FormData) => {
    const file = formData.get("receipt_pdf") as File
    if (file && file.size > 20 * 1024 * 1024) {
      throw new Error("File size too large. Maximum allowed size is 20MB.")
    }

    return AxiosInstance.post("/saveReceipt", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, 
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log(`Upload Progress: ${percentCompleted}%`)
        }
      },
    })
  },

  compressPDF: async (file: File): Promise<File> => {
    return file
  },
  validateFile: (file: File): { valid: boolean; error?: string } => {
    const maxSize = 20 * 1024 * 1024 // 20MB
    const allowedTypes = ["application/pdf"]

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: "Only PDF files are allowed." }
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the maximum limit of 20MB.`,
      }
    }

    return { valid: true }
  },
}

export default ReceiptService
