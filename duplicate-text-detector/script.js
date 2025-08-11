class DuplicateHighlighter {
  constructor() {
    this.fileInput = document.getElementById("fileInput");
    this.fileName = document.getElementById("fileName");
    this.pasteTextarea = document.getElementById("pasteTextarea");
    this.analyzeBtn = document.getElementById("analyzeBtn");
    this.clearBtn = document.getElementById("clearBtn");
    this.pasteInfo = document.getElementById("pasteInfo");
    this.fileContent = document.getElementById("fileContent");
    this.legend = document.getElementById("legend");
    this.legendGrid = document.getElementById("legendGrid");
    this.stats = document.getElementById("stats");

    this.caseSensitive = document.getElementById("caseSensitive");
    this.ignoreWhitespace = document.getElementById("ignoreWhitespace");
    this.ignorePunctuation = document.getElementById("ignorePunctuation");
    this.minLength = document.getElementById("minLength");
    this.minLengthValue = document.getElementById("minLengthValue");
    this.matchCompleteLine = document.getElementById("matchCompleteLine");

    this.highlightClasses = [
      "highlight-1",
      "highlight-2",
      "highlight-3",
      "highlight-4",
      "highlight-5",
      "highlight-6",
      "highlight-7",
      "highlight-8",
      "highlight-9",
      "highlight-10",
      "highlight-11",
      "highlight-12",
      "highlight-13",
      "highlight-14",
      "highlight-15",
      "highlight-16",
      "highlight-17",
      "highlight-18",
      "highlight-19",
      "highlight-20",
      "highlight-21",
      "highlight-22",
      "highlight-23",
      "highlight-24",
      "highlight-25",
      "highlight-26",
      "highlight-27",
      "highlight-28",
      "highlight-29",
      "highlight-30",
      "highlight-31",
      "highlight-32",
      "highlight-33",
      "highlight-34",
      "highlight-35",
      "highlight-36",
      "highlight-37",
      "highlight-38",
      "highlight-39",
      "highlight-40",
      "highlight-41",
      "highlight-42",
      "highlight-43",
      "highlight-44",
      "highlight-45",
      "highlight-46",
      "highlight-47",
      "highlight-48",
      "highlight-49",
      "highlight-50",
      "highlight-51",
      "highlight-52",
      "highlight-53",
      "highlight-54",
      "highlight-55",
      "highlight-56",
      "highlight-57",
      "highlight-58",
      "highlight-59",
      "highlight-60",
      "highlight-61",
      "highlight-62",
      "highlight-63",
      "highlight-64",
    ];

    this.currentLines = [];
    this.currentDuplicateGroups = [];
    this.selectedGroupIndex = null;
    this.currentSource = null; // 'file' or 'paste'

    this.initEventListeners();
  }

  initEventListeners() {
    // Tab switching
    document.querySelectorAll(".tab-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const tabName = e.target.dataset.tab;
        this.switchTab(tabName);
      });
    });

    // File upload styling
    this.fileInput.addEventListener("change", (e) => {
      const fileName = document.getElementById("fileName");
      if (e.target.files.length > 0) {
        fileName.textContent = e.target.files[0].name;
        fileName.classList.add("has-file");
      } else {
        fileName.textContent = "No file selected";
        fileName.classList.remove("has-file");
      }
    });

    // File upload
    this.fileInput.addEventListener("click", () => {
      this.fileInput.value = null; // reset input so 'change' triggers even on same file
    });
    this.fileInput.addEventListener("change", (e) => this.handleFileSelect(e));

    // Text paste
    this.pasteTextarea.addEventListener("input", () => this.updatePasteInfo());
    this.analyzeBtn.addEventListener("click", () => this.analyzePastedText());
    this.clearBtn.addEventListener("click", () => this.clearPastedText());

    // Settings
    this.caseSensitive.addEventListener("change", () =>
      this.reprocessContent()
    );
    this.ignoreWhitespace.addEventListener("change", () =>
      this.reprocessContent()
    );
    this.ignorePunctuation.addEventListener("change", () =>
      this.reprocessContent()
    );
    this.matchCompleteLine.addEventListener("change", () =>
      this.reprocessContent()
    );
    this.minLength.addEventListener("input", (e) => {
      this.minLengthValue.textContent = e.target.value;
      this.reprocessContent();
    });
  }

  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll(".tab-button").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

    // Update tab content
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
    });
    document.getElementById(`${tabName}-tab`).classList.add("active");

    const fileName = document.getElementById("fileName");
    fileName.textContent = "No file selected";
    fileName.classList.remove("has-file");

    // Clear current content when switching tabs
    this.clearCurrentContent();
  }

  clearCurrentContent() {
    this.currentFileContent = null;
    this.currentLines = [];
    this.currentDuplicateGroups = [];
    this.selectedGroupIndex = null;
    this.currentSource = null;

    this.fileName.textContent = "No file selected";
    this.fileContent.innerHTML = `
                    <div class="no-file">
                        <p>📁 Please select a text file or paste content to begin analysis</p>
                    </div>
                `;
    this.stats.style.display = "none";
    this.legend.style.display = "none";
  }

  updatePasteInfo() {
    const text = this.pasteTextarea.value;
    const lines = text ? text.split("\n").length : 0;
    const chars = text.length;

    this.pasteInfo.textContent = `${chars.toLocaleString()} characters, ${lines.toLocaleString()} lines`;
    this.analyzeBtn.disabled = chars === 0;
  }

  analyzePastedText() {
    const text = this.pasteTextarea.value;
    if (!text) return;

    this.currentFileContent = text;
    this.currentSource = "paste";
    this.processContent();
  }

  clearPastedText() {
    this.pasteTextarea.value = "";
    this.updatePasteInfo();
    this.clearCurrentContent();
  }

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    this.fileName.textContent = file.name;

    if (!this.isTextFile(file)) {
      this.showError("Please select a valid text file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentFileContent = e.target.result;
      this.currentSource = "file";
      this.processContent();
    };
    reader.onerror = () => {
      this.showError("Error reading file");
    };
    reader.readAsText(file);
  }

  isTextFile(file) {
    const textTypes = [
      "text/",
      "application/json",
      "application/xml",
      "application/javascript",
      "application/css",
    ];
    return (
      textTypes.some((type) => file.type.startsWith(type)) ||
      file.name.match(
        /\.(txt|md|csv|log|json|xml|html|css|js|py|java|cpp|c|h)$/i
      )
    );
  }

  reprocessContent() {
    if (this.currentFileContent) {
      this.processContent();
    }
  }

  processContent() {
    if (!this.currentFileContent) return;

    const lines = this.currentFileContent.split("\n");
    const duplicateGroups = this.matchCompleteLine?.checked
      ? this.findLineDuplicates(lines)
      : this.findSubstringDuplicates(lines);

    this.currentLines = lines;
    this.currentDuplicateGroups = duplicateGroups;
    this.selectedGroupIndex = null;

    this.displayContent(lines, duplicateGroups);
    this.updateStats(lines, duplicateGroups);
    this.updateLegend(duplicateGroups);

    this.stats.style.display = "block";
    this.legend.style.display = duplicateGroups.length > 0 ? "block" : "none";
  }

  findLineDuplicates(lines) {
    const processed = lines.map((line) => this.processLine(line));
    const lineMap = new Map();
    const minLen = parseInt(this.minLength.value);

    // Group lines by processed content
    processed.forEach((processedLine, index) => {
      if (processedLine.length >= minLen) {
        if (!lineMap.has(processedLine)) {
          lineMap.set(processedLine, []);
        }

        lineMap.get(processedLine).push({
          lineIndex: index,
          startPos: 0,
          endPos: lines[index].length,
          originalText: lines[index],
        });
      }
    });

    // Filter groups with duplicates (more than one occurrence)
    const duplicateGroups = [];
    lineMap.forEach((occurrences, content) => {
      if (occurrences.length > 1) {
        duplicateGroups.push({
          content: content,
          occurrences: occurrences,
          type: "line",
        });
      }
    });

    return duplicateGroups;
  }

  findSubstringDuplicates(lines) {
    const minLen = parseInt(this.minLength.value);
    const allOccurrences = [];

    lines.forEach((line, lineIndex) => {
      const processedLine = this.processLine(line);

      // Generate all substrings and find their occurrences
      for (let length = minLen; length <= processedLine.length; length++) {
        for (let start = 0; start <= processedLine.length - length; start++) {
          const substring = processedLine.substring(start, start + length);

          const end = start + length;
          allOccurrences.push({
            substring: substring,
            lineIndex: lineIndex,
            startPos: start,
            endPos: end,
            originalText: line.substring(start, end),
          });
        }
      }
    });

    // Group by substring content
    const substringMap = new Map();
    allOccurrences.forEach((occurrence) => {
      if (!substringMap.has(occurrence.substring)) {
        substringMap.set(occurrence.substring, []);
      }
      substringMap.get(occurrence.substring).push(occurrence);
    });

    // Filter duplicates and resolve overlaps
    const duplicateGroups = [];
    const processedLineIndices = new Set();

    // Sort by substring length (longest first) to prioritize longer matches
    const sortedEntries = Array.from(substringMap.entries())
      .filter(([_, occurrences]) => occurrences.length > 1)
      .sort(([a], [b]) => b.length - a.length);

    sortedEntries.forEach(([substring, occurrences]) => {
      if (occurrences.length < 2) return;

      // Group by line and apply activity selection
      const lineGroups = new Map();
      occurrences.forEach((occ) => {
        if (!lineGroups.has(occ.lineIndex)) {
          lineGroups.set(occ.lineIndex, []);
        }
        lineGroups.get(occ.lineIndex).push(occ);
      });

      let validOccurrences = [];

      lineGroups.forEach((lineOccs) => {
        // Sort by end position
        lineOccs.sort((a, b) => a.endPos - b.endPos);

        // Activity selection: pick first, then pick next non-overlapping
        const selected = [lineOccs[0]];
        let lastEnd = lineOccs[0].endPos;

        for (let i = 1; i < lineOccs.length; i++) {
          if (lineOccs[i].startPos >= lastEnd) {
            selected.push(lineOccs[i]);
            lastEnd = lineOccs[i].endPos;
          }
        }

        validOccurrences = validOccurrences.concat(selected);
      });

      // Filter out occurrences from already processed line indices
      const filteredOccurrences = validOccurrences.filter(occ => 
        !processedLineIndices.has(occ.lineIndex)
      );

      if (filteredOccurrences.length > 1) {
        filteredOccurrences.forEach(occ => 
          processedLineIndices.add(occ.lineIndex)
        );

        duplicateGroups.push({
          content: substring,
          occurrences: filteredOccurrences,
          type: "substring",
        });
      }
    });

    return duplicateGroups;
  }

  processLine(line) {
    let processed = line;

    if (!this.caseSensitive.checked) {
      processed = processed.toLowerCase();
    }

    if (this.ignoreWhitespace.checked) {
      processed = processed.replace(/\s+/g, " ").trim();
    }

    if (this.ignorePunctuation.checked) {
      processed = processed.replace(/[^\w\s]/g, " ");
    }

    return processed;
  }

  displayContent(lines, duplicateGroups, selectedGroupIndex = null) {
    const lineHighlights = new Array(lines.length).fill(null).map(() => []);

    duplicateGroups.forEach((group, groupIndex) => {
      const highlightClass =
        this.highlightClasses[groupIndex % this.highlightClasses.length];

      group.occurrences.forEach((occurrence) => {
        lineHighlights[occurrence.lineIndex].push({
          start: occurrence.startPos,
          end: occurrence.endPos,
          class: highlightClass,
          groupIndex: groupIndex,
        });
      });
    });

    let contentHtml;

    if (selectedGroupIndex !== null) {
      // Show only selected group with new data structure
      const selectedGroup = duplicateGroups[selectedGroupIndex];
      const highlightClass =
        this.highlightClasses[
          selectedGroupIndex % this.highlightClasses.length
        ];

      contentHtml = selectedGroup.occurrences
        .map((occurrence) => {
          const lineNumber = (occurrence.lineIndex + 1)
            .toString()
            .padStart(4, " ");
          const line = lines[occurrence.lineIndex];
          const highlightedLine = this.highlightLineSegments(line, [
            {
              start: occurrence.startPos,
              end: occurrence.endPos,
              class: highlightClass,
            },
          ]);

          return `<span style="color: #666;">${lineNumber}</span> ${highlightedLine}`;
        })
        .join("\n");
    } else {
      contentHtml = lines
        .map((line, index) => {
          const lineNumber = (index + 1).toString().padStart(4, " ");
          const highlights = lineHighlights[index];

          if (highlights.length > 0) {
            const highlightedLine = this.highlightLineSegments(
              line,
              highlights
            );
            return `<span style="color: #666;">${lineNumber}</span> ${highlightedLine}`;
          } else {
            const escapedLine = this.escapeHtml(line);
            return `<span style="color: #666;">${lineNumber}</span> ${escapedLine}`;
          }
        })
        .join("\n");
    }

    this.fileContent.innerHTML = contentHtml;
  }

  highlightLineSegments(line, highlights) {
    if (highlights.length === 0) {
      return this.escapeHtml(line);
    }

    // Sort highlights by start position
    highlights.sort((a, b) => a.start - b.start);

    let result = "";
    let currentPos = 0;

    highlights.forEach((highlight) => {
      // Add text before highlight
      if (currentPos < highlight.start) {
        result += this.escapeHtml(line.substring(currentPos, highlight.start));
      }

      // Add highlighted text
      const highlightedText = this.escapeHtml(
        line.substring(highlight.start, highlight.end)
      );
      result += `<span class="${highlight.class}">${highlightedText}</span>`;

      currentPos = Math.max(currentPos, highlight.end);
    });

    // Add remaining text
    if (currentPos < line.length) {
      result += this.escapeHtml(line.substring(currentPos));
    }

    return result;
  }

  // Stats calculation for both line and substring matches
  updateStats(lines, duplicateGroups) {
    const totalLines = lines.length;

    if (this.matchCompleteLine?.checked) {
      // Line-based stats
      const duplicateLineCount = duplicateGroups.reduce(
        (sum, group) => sum + group.occurrences.length,
        0
      );
      const duplicatePercentage =
        totalLines > 0
          ? ((duplicateLineCount / totalLines) * 100).toFixed(1)
          : 0;

      document.getElementById("totalLines").textContent =
        totalLines.toLocaleString();
      document.getElementById("duplicateGroups").textContent =
        duplicateGroups.length;
      document.getElementById("duplicateLines").textContent =
        duplicateLineCount.toLocaleString();
      document.getElementById(
        "duplicatePercentage"
      ).textContent = `${duplicatePercentage}%`;
    } else {
      const totalOccurrences = duplicateGroups.reduce(
        (sum, group) => sum + group.occurrences.length,
        0
      );
      const linesWithDuplicates = new Set();
      duplicateGroups.forEach((group) => {
        group.occurrences.forEach((occ) =>
          linesWithDuplicates.add(occ.lineIndex)
        );
      });

      const duplicatePercentage =
        totalLines > 0
          ? ((linesWithDuplicates.size / totalLines) * 100).toFixed(1)
          : 0;

      document.getElementById("totalLines").textContent =
        totalLines.toLocaleString();
      document.getElementById("duplicateGroups").textContent =
        duplicateGroups.length;
      document.getElementById(
        "duplicateLines"
      ).textContent = `${totalOccurrences.toLocaleString()} matches`;
      document.getElementById(
        "duplicatePercentage"
      ).textContent = `${duplicatePercentage}%`;
    }
  }

  updateLegend(duplicateGroups) {
    if (duplicateGroups.length === 0) {
      this.legendGrid.innerHTML = "";
      return;
    }

    const legendHtml = duplicateGroups
      .slice(0, 64)
      .map((group, index) => {
        const highlightClass =
          this.highlightClasses[index % this.highlightClasses.length];
        const preview =
          group.content.substring(0, 50) +
          (group.content.length > 50 ? "..." : "");
        const isActive = this.selectedGroupIndex === index ? "active" : "";
        const matchType = group.type === "line" ? "lines" : "matches";

        return `
        <div class="legend-item ${isActive}" data-group-index="${index}">
          <div class="legend-color ${highlightClass}"></div>
          <div>
            <div style="font-weight: bold;">${
              group.occurrences.length
            } ${matchType}</div>
            <div style="font-size: 12px; color: #666;" title="${this.escapeHtml(
              group.content
            )}">${this.escapeHtml(preview)}</div>
          </div>
        </div>
      `;
      })
      .join("");

    this.legendGrid.innerHTML = legendHtml;

    // Add click event listeners to legend items
    this.legendGrid.querySelectorAll(".legend-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        const groupIndex = parseInt(item.dataset.groupIndex);
        this.showGroup(groupIndex);
      });
    });

    // Update legend header with show all button
    const legendHeader = this.legend.querySelector("h3");
    if (this.selectedGroupIndex !== null) {
      legendHeader.innerHTML = `Duplicate Groups <button class="show-all-btn" onclick="duplicateHighlighter.showAllGroups()">Show All</button>`;
    } else {
      legendHeader.innerHTML = "Duplicate Groups";
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  showGroup(groupIndex) {
    this.selectedGroupIndex = groupIndex;
    this.displayContent(
      this.currentLines,
      this.currentDuplicateGroups,
      groupIndex
    );
    this.updateLegend(this.currentDuplicateGroups);

    // Update stats for selected group with dynamic match type
    const selectedGroup = this.currentDuplicateGroups[groupIndex];
    const matchType = selectedGroup.type === "line" ? "lines" : "matches";

    document.getElementById("totalLines").textContent =
      selectedGroup.occurrences.length.toLocaleString();
    document.getElementById("duplicateGroups").textContent = "1";
    document.getElementById(
      "duplicateLines"
    ).textContent = `${selectedGroup.occurrences.length} ${matchType}`;
    document.getElementById("duplicatePercentage").textContent = "100%";
  }

  showAllGroups() {
    this.selectedGroupIndex = null;
    this.displayContent(this.currentLines, this.currentDuplicateGroups);
    this.updateStats(this.currentLines, this.currentDuplicateGroups);
    this.updateLegend(this.currentDuplicateGroups);
  }

  showError(message) {
    const existingError = document.querySelector(".error");
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.textContent = message;

    document
      .querySelector(".container")
      .insertBefore(errorDiv, document.querySelector(".controls"));

    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }
}

// Initialize the application
let duplicateHighlighter;
document.addEventListener("DOMContentLoaded", () => {
  duplicateHighlighter = new DuplicateHighlighter();
});
