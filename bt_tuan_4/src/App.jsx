import React, { useState, useEffect } from 'react'
import SearchForm from './components/SearchForm'
import ResultTable from './components/ResultTable'
import LoadingIndicator from './components/LoadingIndicator'
import './styles.css'


function convertScore(score) {
  if (score >= 9.5) return "A+";
  if (score >= 8.5) return "A";
  if (score >= 8) return "B+";
  if (score >= 7) return "B";
  if (score >= 6.5) return "C+";
  if (score >= 5.5) return "C";
  if (score >= 5) return "D+";
  if (score >= 4) return "D";
  return "F";
}

export default function App() {
  const [studentId, setStudentId] = useState('')
  const [searchId, setSearchId] = useState(null) 
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])
  const [student, setStudent] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!searchId) return

    let cancelled = false
    setIsLoading(true)
    setResults([])
    setStudent(null)
    setError(null)

    async function fetchData() {
      try {
        const [sRes, hRes, kRes] = await Promise.all([
          fetch('/sinhvien.json').then(r => r.json()),
          fetch('/hocphan.json').then(r => r.json()),
          fetch('/ketqua.json').then(r => r.json())
        ])

        await new Promise(res => setTimeout(res, 1500))

        if (cancelled) return

        const sv = sRes.find(s => s.sid === searchId)
        if (!sv) {
          setError(`Không tìm thấy sinh viên với mã: ${searchId}`)
          setIsLoading(false)
          return
        }

        // build a map for hocphan
        const hocphanMap = {}
        hRes.forEach(h => { hocphanMap[h.cid] = h })

        const entries = kRes.filter(k => k.sid === searchId).map(k => {
          const hp = hocphanMap[k.cid] || { cid: k.cid, name: 'Không rõ', credits: '?' }
          return {
            cid: k.cid,
            name: hp.name,
            credits: hp.credits,
            score: k.score,
            grade: convertScore(k.score)
          }
        })

        setStudent(sv)
        setResults(entries)
        setIsLoading(false)
      } catch (err) {
        if (!cancelled) {
          setError('Lỗi khi tải dữ liệu: ' + err.message)
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => { cancelled = true }
  }, [searchId])

  function handleSearch() {
    // if empty, show error
    const id = studentId.trim()
    if (!id) {
      setError('Vui lòng nhập mã số sinh viên')
      return
    }
    setSearchId(id)
  }

  return (
    <>
      <h1>Tra cứu kết quả học tập</h1>
      <SearchForm
        studentId={studentId}
        setStudentId={setStudentId}
        onSearch={handleSearch}
      />

      <div className="result-area">
        {isLoading && <LoadingIndicator />}

        {!isLoading && error && (
          <div className="error">{error}</div>
        )}

        {!isLoading && !error && student && (
          <>
            <div className="student-info">
              <strong>{student.name}</strong> — MSSV: {student.sid}
            </div>
            <ResultTable results={results} />
          </>
        )}

        {!isLoading && !error && !student && searchId && (
          <div>Không có kết quả để hiển thị.</div>
        )}
      </div>
    </>
  )
}
