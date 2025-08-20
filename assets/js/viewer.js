class CSVEditor {
    constructor() {
        this.data = [];
        this.originalData = [];
        this.isModified = false;
        this.filename = '';
        
        // Pagination properties
        this.currentPage = 1;
        this.rowsPerPage = 25;
        this.totalDataRows = 0;
        
        this.initElements();
        this.initEventListeners();
        this.initTheme();
        this.checkForURLParameter();
    }

    initElements() {
        this.fileInput = document.getElementById('csvFile');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.dropZone = document.getElementById('dropZone');
        this.exportBtn = document.getElementById('exportBtn');
        this.themeToggle = document.getElementById('themeToggle');
        this.fileInfo = document.getElementById('fileInfo');
        this.errorDiv = document.getElementById('error');
        this.successDiv = document.getElementById('success');
        this.loadingDiv = document.getElementById('loading');
        this.emptyState = document.getElementById('emptyState');
        this.tableContainer = document.getElementById('tableContainer');
        this.table = document.getElementById('csvTable');
        this.tableHead = document.getElementById('tableHead');
        this.tableBody = document.getElementById('tableBody');
        this.stats = document.getElementById('stats');
        this.rowCount = document.getElementById('rowCount');
        this.colCount = document.getElementById('colCount');
        this.modifiedStat = document.getElementById('modifiedStat');
        
        // Pagination elements
        this.rowsPerPageSelect = document.getElementById('rowsPerPage');
        this.paginationInfo = document.getElementById('paginationInfo');
        this.firstPageBtn = document.getElementById('firstPageBtn');
        this.prevPageBtn = document.getElementById('prevPageBtn');
        this.nextPageBtn = document.getElementById('nextPageBtn');
        this.lastPageBtn = document.getElementById('lastPageBtn');
        this.pageNumbers = document.getElementById('pageNumbers');
    }

    initEventListeners() {
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        this.dropZone.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.exportBtn.addEventListener('click', () => this.exportCSV());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Pagination event listeners
        this.rowsPerPageSelect.addEventListener('change', (e) => this.changeRowsPerPage(e));
        this.firstPageBtn.addEventListener('click', () => this.goToPage(1));
        this.prevPageBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        this.nextPageBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        this.lastPageBtn.addEventListener('click', () => this.goToPage(this.getTotalPages()));
        
        // Drag and drop events
        this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.dropZone.addEventListener('dragenter', (e) => this.handleDragEnter(e));
        this.dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));
        
        // Prevent default drag behavior on document
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', (e) => e.preventDefault());
        
        // Handle paste events for bulk editing
        document.addEventListener('paste', (e) => this.handlePaste(e));
    }

    initTheme() {
        const savedTheme = localStorage.getItem('csvEditor-theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('csvEditor-theme', newTheme);
    }

    async checkForURLParameter() {
        const urlParams = new URLSearchParams(window.location.search);
        const csvUrl = urlParams.get('url');
        
        if (csvUrl) {
            await this.loadCSVFromURL(csvUrl);
        }
    }

    async loadCSVFromURL(url) {
        try {
            this.showLoading('Loading CSV from URL...');
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch CSV: ${response.statusText}`);
            }
            
            const text = await response.text();
            this.filename = this.getFilenameFromURL(url);
            this.processCSVText(text);
            
        } catch (error) {
            this.showError('Error loading CSV from URL: ' + error.message);
            this.hideLoading();
        }
    }

    getFilenameFromURL(url) {
        try {
            const pathname = new URL(url).pathname;
            return pathname.split('/').pop() || 'remote.csv';
        } catch {
            return 'remote.csv';
        }
    }

    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dropZone.classList.add('drag-over');
    }

    handleDragEnter(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dropZone.classList.add('drag-over');
    }

    handleDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        
        // Only remove drag-over if we're actually leaving the drop zone
        if (!this.dropZone.contains(event.relatedTarget)) {
            this.dropZone.classList.remove('drag-over');
        }
    }

    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dropZone.classList.remove('drag-over');
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            
            // Validate file type
            if (this.isValidCSVFile(file)) {
                this.processFile(file);
            } else {
                this.showError('Please drop a valid CSV file (.csv, .txt)');
            }
        }
    }

    isValidCSVFile(file) {
        const validExtensions = ['.csv', '.txt'];
        const validTypes = ['text/csv', 'text/plain', 'application/csv'];
        
        const hasValidExtension = validExtensions.some(ext => 
            file.name.toLowerCase().endsWith(ext)
        );
        const hasValidType = validTypes.includes(file.type);
        
        return hasValidExtension || hasValidType;
    }

    async processFile(file) {
        try {
            this.showLoading('Reading file...');
            
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                throw new Error('File too large. Please use files under 10MB.');
            }

            const text = await file.text();
            this.filename = file.name;
            this.processCSVText(text);
            
        } catch (error) {
            this.showError('Error reading file: ' + error.message);
            this.hideLoading();
        }
    }

    async handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        await this.processFile(file);
    }

    processCSVText(text) {
        try {
            this.hideError();
            this.hideSuccess();
            
            const data = this.parseCSV(text);
            
            if (data.length === 0) {
                throw new Error('No data found in the CSV file.');
            }

            this.data = data;
            this.originalData = JSON.parse(JSON.stringify(data)); // Deep copy
            this.isModified = false;
            this.totalDataRows = data.length - 1; // Exclude header
            this.currentPage = 1; // Reset to first page
            
            this.displayData();
            this.updateFileInfo();
            this.updateStats();
            this.updatePagination();
            this.hideLoading();
            
            this.showSuccess('CSV loaded successfully!');
            setTimeout(() => this.hideSuccess(), 3000);
            
        } catch (error) {
            this.showError('Error processing CSV: ' + error.message);
            this.hideLoading();
        }
    }

    parseCSV(text) {
        const lines = text.trim().split('\n');
        if (lines.length === 0) return [];

        // Detect delimiter
        const firstLine = lines[0];
        let delimiter = ',';
        const delimiters = [',', '\t', ';', '|'];
        let maxCount = 0;

        for (const del of delimiters) {
            const count = (firstLine.match(new RegExp('\\' + del, 'g')) || []).length;
            if (count > maxCount) {
                maxCount = count;
                delimiter = del;
            }
        }

        // Enhanced CSV parsing with better quote handling
        return lines.map(line => {
            const result = [];
            let current = '';
            let inQuotes = false;
            let i = 0;
            
            while (i < line.length) {
                const char = line[i];
                const nextChar = line[i + 1];
                
                if (char === '"') {
                    if (inQuotes && nextChar === '"') {
                        // Escaped quote
                        current += '"';
                        i += 2;
                        continue;
                    } else if (inQuotes) {
                        // End quote
                        inQuotes = false;
                    } else {
                        // Start quote
                        inQuotes = true;
                    }
                } else if (char === delimiter && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
                i++;
            }
            
            result.push(current.trim());
            return result;
        });
    }

    displayData() {
        this.tableHead.innerHTML = '';
        this.tableBody.innerHTML = '';

        if (this.data.length === 0) return;

        // Create header
        const headerRow = document.createElement('tr');
        this.data[0].forEach((header, index) => {
            const th = document.createElement('th');
            th.textContent = header || `Column ${index + 1}`;
            th.title = th.textContent;
            headerRow.appendChild(th);
        });
        this.tableHead.appendChild(headerRow);

        // Calculate pagination
        const startRow = (this.currentPage - 1) * this.rowsPerPage + 1;
        const endRow = Math.min(startRow + this.rowsPerPage - 1, this.totalDataRows);

        // Create body rows with editable cells (only for current page)
        for (let i = startRow; i <= endRow; i++) {
            const row = document.createElement('tr');
            const rowData = this.data[i] || [];
            
            for (let j = 0; j < this.data[0].length; j++) {
                const td = document.createElement('td');
                const input = document.createElement('input');
                
                input.className = 'cell-input';
                input.type = 'text';
                input.value = rowData[j] || '';
                input.dataset.row = i;
                input.dataset.col = j;
                
                // Add event listeners for editing
                input.addEventListener('input', (e) => this.handleCellEdit(e));
                input.addEventListener('keydown', (e) => this.handleCellKeydown(e));
                
                td.appendChild(input);
                row.appendChild(td);
            }
            
            this.tableBody.appendChild(row);
        }

        this.showTable();
    }

    handleCellEdit(event) {
        const input = event.target;
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        const newValue = input.value;
        
        // Ensure the row exists in data
        if (!this.data[row]) {
            this.data[row] = new Array(this.data[0].length).fill('');
        }
        
        // Update data
        this.data[row][col] = newValue;
        
        // Mark as modified
        if (!this.isModified) {
            this.isModified = true;
            this.modifiedStat.style.display = 'flex';
            this.exportBtn.style.display = 'inline-flex';
        }
    }

    handleCellKeydown(event) {
        const input = event.target;
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        
        switch (event.key) {
            case 'Tab':
                event.preventDefault();
                this.focusNextCell(row, col, event.shiftKey ? -1 : 1);
                break;
            case 'Enter':
                event.preventDefault();
                this.focusNextCell(row + 1, col, 0);
                break;
            case 'ArrowUp':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.focusNextCell(row - 1, col, 0);
                }
                break;
            case 'ArrowDown':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.focusNextCell(row + 1, col, 0);
                }
                break;
        }
    }

    focusNextCell(targetRow, targetCol, colDelta) {
        // Calculate next position
        let nextRow = targetRow;
        let nextCol = targetCol + colDelta;
        
        // Handle column overflow
        if (nextCol >= this.data[0].length) {
            nextCol = 0;
            nextRow++;
        } else if (nextCol < 0) {
            nextCol = this.data[0].length - 1;
            nextRow--;
        }
        
        // Find and focus the target cell
        const targetInput = document.querySelector(`input[data-row="${nextRow}"][data-col="${nextCol}"]`);
        if (targetInput) {
            targetInput.focus();
            targetInput.select();
        }
    }

    handlePaste(event) {
        if (document.activeElement.classList.contains('cell-input')) {
            const pastedData = event.clipboardData.getData('text');
            if (pastedData.includes('\n') || pastedData.includes('\t')) {
                event.preventDefault();
                this.pasteBulkData(pastedData, document.activeElement);
            }
        }
    }

    pasteBulkData(pastedData, startCell) {
        const startRow = parseInt(startCell.dataset.row);
        const startCol = parseInt(startCell.dataset.col);
        const lines = pastedData.trim().split('\n');
        
        lines.forEach((line, rowOffset) => {
            const cells = line.split('\t').length > 1 ? line.split('\t') : line.split(',');
            cells.forEach((cellValue, colOffset) => {
                const targetRow = startRow + rowOffset;
                const targetCol = startCol + colOffset;
                
                if (targetCol < this.data[0].length) {
                    // Ensure row exists
                    if (!this.data[targetRow]) {
                        this.data[targetRow] = new Array(this.data[0].length).fill('');
                    }
                    
                    // Update data
                    this.data[targetRow][targetCol] = cellValue.trim();
                    
                    // Update input if it exists
                    const targetInput = document.querySelector(`input[data-row="${targetRow}"][data-col="${targetCol}"]`);
                    if (targetInput) {
                        targetInput.value = cellValue.trim();
                    }
                }
            });
        });
        
        this.isModified = true;
        this.modifiedStat.style.display = 'flex';
        this.exportBtn.style.display = 'inline-flex';
    }

    exportCSV() {
        try {
            const csvContent = this.generateCSVContent();
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', this.filename || 'edited_data.csv');
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                this.showSuccess('CSV exported successfully!');
                setTimeout(() => this.hideSuccess(), 3000);
            }
        } catch (error) {
            this.showError('Error exporting CSV: ' + error.message);
        }
    }

    generateCSVContent() {
        return this.data.map(row => {
            return row.map(cell => {
                // Escape quotes and wrap in quotes if necessary
                const cellStr = String(cell || '');
                if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                    return '"' + cellStr.replace(/"/g, '""') + '"';
                }
                return cellStr;
            }).join(',');
        }).join('\n');
    }

    updateFileInfo() {
        if (this.filename) {
            this.fileInfo.innerHTML = `
                <span>📄 ${this.filename}</span>
            `;
        }
    }

    // Pagination methods
    getTotalPages() {
        return Math.ceil(this.totalDataRows / this.rowsPerPage);
    }

    goToPage(page) {
        const totalPages = this.getTotalPages();
        if (page >= 1 && page <= totalPages && page !== this.currentPage) {
            this.currentPage = page;
            this.displayData();
            this.updatePagination();
        }
    }

    changeRowsPerPage(event) {
        this.rowsPerPage = parseInt(event.target.value);
        this.currentPage = 1; // Reset to first page
        this.displayData();
        this.updatePagination();
    }

    updatePagination() {
        if (this.totalDataRows === 0) return;

        const totalPages = this.getTotalPages();
        const startRow = (this.currentPage - 1) * this.rowsPerPage + 1;
        const endRow = Math.min(startRow + this.rowsPerPage - 1, this.totalDataRows);

        // Update pagination info
        this.paginationInfo.textContent = `Showing ${startRow}-${endRow} of ${this.totalDataRows} rows`;

        // Update button states
        this.firstPageBtn.disabled = this.currentPage === 1;
        this.prevPageBtn.disabled = this.currentPage === 1;
        this.nextPageBtn.disabled = this.currentPage === totalPages;
        this.lastPageBtn.disabled = this.currentPage === totalPages;

        // Update page numbers
        this.updatePageNumbers(totalPages);
    }

    updatePageNumbers(totalPages) {
        this.pageNumbers.innerHTML = '';

        if (totalPages <= 1) return;

        // Determine which page numbers to show
        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(totalPages, this.currentPage + 2);

        // Adjust if we're near the beginning or end
        if (endPage - startPage < 4) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + 4);
            } else if (endPage === totalPages) {
                startPage = Math.max(1, endPage - 4);
            }
        }

        // Add ellipsis and first page if needed
        if (startPage > 1) {
            this.addPageButton(1);
            if (startPage > 2) {
                this.addEllipsis();
            }
        }

        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            this.addPageButton(i, i === this.currentPage);
        }

        // Add ellipsis and last page if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                this.addEllipsis();
            }
            this.addPageButton(totalPages);
        }
    }

    addPageButton(pageNum, isActive = false) {
        const button = document.createElement('button');
        button.className = `pagination-btn ${isActive ? 'active' : ''}`;
        button.textContent = pageNum;
        button.addEventListener('click', () => this.goToPage(pageNum));
        this.pageNumbers.appendChild(button);
    }

    addEllipsis() {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-btn';
        ellipsis.textContent = '...';
        ellipsis.style.cursor = 'default';
        ellipsis.style.border = 'none';
        ellipsis.style.background = 'transparent';
        this.pageNumbers.appendChild(ellipsis);
    }

    updateStats() {
        if (this.data.length > 0) {
            this.rowCount.textContent = `${this.totalDataRows} rows`;
            this.colCount.textContent = `${this.data[0].length} columns`;
            this.stats.style.display = 'flex';
        }
    }

    showTable() {
        this.emptyState.style.display = 'none';
        this.tableContainer.style.display = 'block';
        this.exportBtn.style.display = 'inline-flex';
    }

    hideTable() {
        this.tableContainer.style.display = 'none';
        this.emptyState.style.display = 'flex';
        this.exportBtn.style.display = 'none';
        this.stats.style.display = 'none';
        this.modifiedStat.style.display = 'none';
    }

    showLoading(message = 'Loading...') {
        this.loadingDiv.querySelector('div:last-child').textContent = message;
        this.loadingDiv.style.display = 'flex';
        this.hideTable();
    }

    hideLoading() {
        this.loadingDiv.style.display = 'none';
    }

    showError(message) {
        this.errorDiv.textContent = message;
        this.errorDiv.style.display = 'block';
        this.hideSuccess();
    }

    hideError() {
        this.errorDiv.style.display = 'none';
    }

    showSuccess(message) {
        this.successDiv.textContent = message;
        this.successDiv.style.display = 'block';
        this.hideError();
    }

    hideSuccess() {
        this.successDiv.style.display = 'none';
    }
}

// Initialize the CSV editor when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CSVEditor();
});
