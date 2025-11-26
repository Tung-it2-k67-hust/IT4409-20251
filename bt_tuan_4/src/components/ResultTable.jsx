import React from 'react'

export default function ResultTable({ results }) {
  if (!results || results.length === 0) {
    return <div>Không có kết quả học phần.</div>
  }

  return (
    <table className="result-table">
      <thead>
        <tr>
          <th>STT</th>
          <th>Mã HP</th>
          <th>Tên học phần</th>
          <th>Số TC</th>
          <th>Điểm</th>
          <th>Điểm chữ</th>
        </tr>
      </thead>
      <tbody>
        {results.map((r, idx) => (
          <tr key={`${r.cid}-${idx}`}>
            <td>{idx + 1}</td>
            <td>{r.cid}</td>
            <td>{r.name}</td>
            <td>{r.credits}</td>
            <td>{r.score}</td>
            <td>{r.grade}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
