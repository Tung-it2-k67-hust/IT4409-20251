// Lưu trữ dữ liệu gốc
let originalData20241 = [];
let originalData20242 = [];

// Khởi tạo dữ liệu gốc khi tải trang
window.onload = function() {
    saveOriginalData();
};

function saveOriginalData() {
    const table1 = document.querySelector('#table-20241 tbody');
    const table2 = document.querySelector('#table-20242 tbody');
    
    originalData20241 = Array.from(table1.rows).map(row => row.cloneNode(true));
    originalData20242 = Array.from(table2.rows).map(row => row.cloneNode(true));
}

// Hàm highlight điểm A, A+ (xanh) và F (đen)
function highlightGrades() {
    const tables = document.querySelectorAll('table tbody tr');
    tables.forEach(row => {
        const grade = row.getAttribute('data-grade');
        
        // Xóa các class highlight cũ
        row.classList.remove('highlight-a', 'highlight-f');
        
        // Tô màu xanh cho A và A+
        if (grade === 'A' || grade === 'A+') {
            row.classList.add('highlight-a');
        }
        // Tô màu đen cho F
        else if (grade === 'F') {
            row.classList.add('highlight-f');
        }
    });
}

// Hàm tính GPA
function calculateGPA() {
    const gpaResult = document.getElementById('gpa-result');
    
    // Tính GPA cho học kỳ 20241
    const gpa20241 = calculateSemesterGPA('table-20241');
    
    // Tính GPA cho học kỳ 20242
    const gpa20242 = calculateSemesterGPA('table-20242');
    
    // Hiển thị kết quả
    gpaResult.innerHTML = `
        <div class="gpa-display">
            <h3>Kết Quả Điểm Trung Bình (GPA)</h3>
            <div class="gpa-item">
                <strong>Học kỳ 2024.1:</strong> ${gpa20241.toFixed(2)} / 4.0
            </div>
            <div class="gpa-item">
                <strong>Học kỳ 2024.2:</strong> ${gpa20242.toFixed(2)} / 4.0
            </div>
            <div class="gpa-item">
                <strong>Trung bình cả 2 học kỳ:</strong> ${((gpa20241 + gpa20242) / 2).toFixed(2)} / 4.0
            </div>
        </div>
    `;
}

function calculateSemesterGPA(tableId) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    const rows = tbody.querySelectorAll('tr:not(.hidden)');
    
    let totalScore = 0;
    let totalCredits = 0;
    
    rows.forEach(row => {
        const credits = parseFloat(row.cells[2].textContent);
        const score = parseFloat(row.getAttribute('data-score'));
        const grade = row.getAttribute('data-grade');
        
        // Chỉ tính các môn có tín chỉ > 0 và không phải R (điểm R không tính vào GPA)
        if (credits > 0 && grade !== 'R') {
            totalScore += score * credits;
            totalCredits += credits;
        }
    });
    
    return totalCredits > 0 ? totalScore / totalCredits : 0;
}

// Hàm filter chỉ giữ lại A và A+
function filterTopGrades() {
    const tables = document.querySelectorAll('table tbody tr');
    
    tables.forEach(row => {
        const grade = row.getAttribute('data-grade');
        
        if (grade === 'A' || grade === 'A+') {
            row.classList.remove('hidden');
        } else {
            row.classList.add('hidden');
        }
    });
}

// Hàm sắp xếp theo điểm số (cao -> thấp). Nếu điểm bằng nhau, dùng thứ tự grade để A+ > A
function sortByGrade() {
    sortTable('table-20241');
    sortTable('table-20242');
}

function sortTable(tableId) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    const rows = Array.from(tbody.querySelectorAll('tr'));

    // Bản đồ thứ tự cho các grade để so sánh khi điểm bằng nhau
    const gradeOrder = {
        'A+': 12,
        'A': 11,
        'A-': 10,
        'B+': 9,
        'B': 8,
        'B-': 7,
        'C+': 6,
        'C': 5,
        'C-': 4,
        'D+': 3,
        'D': 2,
        'D-': 1,
        'F': 0,
        'R': -1
    };

    // Sắp xếp theo điểm tăng dần (thấp -> cao). Nếu bằng điểm, dùng gradeOrder để A+ > A
    // (trong thứ tự tăng dần về score thì A sẽ đứng trước A+ khi cùng score vì A+ được coi là "cao hơn").
    rows.sort((a, b) => {
        const scoreA = parseFloat(a.getAttribute('data-score'));
        const scoreB = parseFloat(b.getAttribute('data-score'));

        if (!isNaN(scoreA) && !isNaN(scoreB) && scoreA !== scoreB) {
            return scoreA - scoreB; // low to high
        }

        const gradeA = a.getAttribute('data-grade') || '';
        const gradeB = b.getAttribute('data-grade') || '';
        const rankA = gradeOrder.hasOwnProperty(gradeA) ? gradeOrder[gradeA] : 0;
        const rankB = gradeOrder.hasOwnProperty(gradeB) ? gradeOrder[gradeB] : 0;

        // Vì gradeOrder lớn hơn nghĩa là grade cao hơn (A+ > A). Khi score bằng nhau và ta muốn A+ đứng
        // sau A trong thứ tự tăng dần (A trước A+), thì trả về rankA - rankB.
        return rankA - rankB;
    });

    // Xóa tất cả các hàng hiện tại
    tbody.innerHTML = '';

    // Thêm lại các hàng đã sắp xếp
    rows.forEach(row => tbody.appendChild(row));
}

// Hàm reset về trạng thái ban đầu
function resetTable() {
    // Reset bảng 20241
    const tbody1 = document.querySelector('#table-20241 tbody');
    tbody1.innerHTML = '';
    originalData20241.forEach(row => {
        const newRow = row.cloneNode(true);
        newRow.classList.remove('highlight-a', 'highlight-f', 'hidden');
        tbody1.appendChild(newRow);
    });
    
    // Reset bảng 20242
    const tbody2 = document.querySelector('#table-20242 tbody');
    tbody2.innerHTML = '';
    originalData20242.forEach(row => {
        const newRow = row.cloneNode(true);
        newRow.classList.remove('highlight-a', 'highlight-f', 'hidden');
        tbody2.appendChild(newRow);
    });
    
    // Xóa kết quả GPA
    document.getElementById('gpa-result').innerHTML = '';
}
