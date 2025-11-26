import React from 'react'

export default function SearchForm({ studentId, setStudentId, onSearch }) {
  return (
    <div className="search-form">
      <input
        type="text"
        placeholder="Nhập mã sinh viên..."
        value={studentId}
        onChange={e => setStudentId(e.target.value)}
      />
      <button onClick={onSearch}>Tra cứu</button>
    </div>
  )
}
