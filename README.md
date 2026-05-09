# EUEE Practice Website

**Ethiopian University Entrance Examination (EUEE) Practice Platform**

A modern, fully-responsive website for practicing EUEE sample exam questions. Features interactive quizzes, progress tracking, and detailed result analysis.

## 🎯 Features

### Practice Modes
- **Full Exam** - Complete exams by year and subject
- **By Grade** - Filter questions by grade level (11-12)
- **By Chapter** - Focus on specific chapters

### Quiz Features
- ✅ Real-time progress tracking
- 📊 Instant answer feedback
- 🖼️ Support for image-based questions
- 🔄 Easy question navigation
- 💾 Results summary and detailed review

### User Interface
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎨 Modern gradient styling
- ⚡ Smooth animations and transitions
- 🌓 Clean, professional layout

## 📁 File Structure

```
exam/
├── index.html           # Main HTML file
├── css/
│   └── style.css       # Stylesheet
├── js/
│   └── app.js          # Application logic
├── api/
│   └── questions.php   # Backend API (optional)
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- Optional: PHP server for backend integration

### Installation

1. **Download files** from this repository
2. **Extract** to your web server directory
3. **Open** `index.html` in your web browser

### Quick Start

```bash
# Simply open the index.html file
open index.html

# Or deploy to a web server
cp -r exam/ /var/www/html/
```

## 🔧 Configuration

### Updating Questions Data

Questions are currently using mock data. To connect to your database:

1. **Update `js/app.js`** - Replace mock data with API calls:

```javascript
// Replace mockQuestions with API call
fetch('api/questions.php?year=' + year + '&subject=' + subject)
    .then(response => response.json())
    .then(data => {
        appState.questions = data;
        displayQuestion();
    });
```

2. **Create `api/questions.php`** - Backend endpoint:

```php
<?php
$year = $_GET['year'];
$subject = $_GET['subject'];
$grade = $_GET['grade'] ?? null;
$chapter = $_GET['chapter'] ?? null;

// Query database
$query = "SELECT * FROM euee WHERE year='$year' AND subject='$subject'";
if ($grade) $query .= " AND grade='$grade'";
if ($chapter) $query .= " AND chapter='$chapter'";

// Return JSON
echo json_encode($results);
?>
```

### Customizing Subjects

Edit `index.html` to add/remove subjects:

```html
<select id="subjectSelect">
    <option value="Mathematics">Mathematics</option>
    <option value="Chemistry">Chemistry</option>
    <!-- Add more subjects -->
</select>
```

### Customizing Years and Chapters

Update the select options in `index.html` to match your data:

```html
<!-- Years -->
<option value="2005">2005</option>
<option value="2006">2006</option>
<!-- ... add more years -->

<!-- Chapters -->
<option value="1">Chapter 1</option>
<option value="2">Chapter 2</option>
<!-- ... add more chapters -->
```

## 🎨 Styling

Customize colors in `css/style.css`:

```css
:root {
    --primary-color: #2196F3;      /* Main blue */
    --secondary-color: #FF9800;    /* Orange accent */
    --success-color: #4CAF50;      /* Green for correct */
    --danger-color: #f44336;       /* Red for incorrect */
    --warning-color: #FFC107;      /* Yellow for warning */
}
```

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔌 Integrating with Your Database

### Example: Using Existing euee Table

**Backend (`api/questions.php`):**

```php
<?php
header('Content-Type: application/json');

// Database connection
$mysqli_id = new mysqli('localhost', 'user', 'password', 'euee_db');

if ($mysqli_id->connect_error) {
    die(json_encode(['error' => $mysqli_id->connect_error]));
}

$year = $mysqli_id->real_escape_string($_GET['year']);
$subject = $mysqli_id->real_escape_string($_GET['subject']);
$grade = isset($_GET['grade']) ? $mysqli_id->real_escape_string($_GET['grade']) : null;
$chapter = isset($_GET['chapter']) ? $mysqli_id->real_escape_string($_GET['chapter']) : null;

$query = "SELECT id, Question as question, Question_image as image, A, B, C, D, AnswerKey as correct_index FROM euee WHERE Subject='$subject' AND Year='$year'";

if ($grade) $query .= " AND GradeHS='$grade'";
if ($chapter) $query .= " AND Chapter='$chapter'";

$result = $mysqli_id->query($query);
$questions = [];

while ($row = $result->fetch_assoc()) {
    $questions[] = [
        'id' => $row['id'],
        'question' => $row['question'],
        'image' => $row['image'],
        'options' => [$row['A'], $row['B'], $row['C'], $row['D']],
        'correct' => ord($row['correct_index']) - 65 // Convert A,B,C,D to 0,1,2,3
    ];
}

echo json_encode($questions);
$mysqli_id->close();
?>
```

## 📊 Features Roadmap

- [ ] User authentication & progress tracking
- [ ] Leaderboard & statistics
- [ ] Timed exams
- [ ] Category-based practice
- [ ] Explanations for answers
- [ ] Dark mode
- [ ] Export results as PDF
- [ ] Multi-language support

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or issues, please contact the repository owner.

## 📚 References

- [Ethiopian National Examinations Agency (NEAEA)](https://neaea.gov.et/)
- Source: Ethiopian University Entrance Examination (EUEE)

---

**Made with ❤️ for Ethiopian students**
