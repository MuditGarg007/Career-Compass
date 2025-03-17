const express = require("express");
const bodyParser = require("body-parser");
const ejsMate = require("ejs-mate");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Home Route
app.get("/", (req, res) => {
    res.render("quiz/index.ejs");
});

// Quiz Route
app.get("/quiz", (req, res) => {
    res.render("quiz/quiz.ejs");
});

app.get("/test", (req, res) => {
    let careerList = [
        'Software Engineer: Designs and develops innovative software solutions, leveraging your problem-solving skills and technological interests.',
        ' UX/UI Designer: Creates user-friendly interfaces, utilizing your creative skills and remote work preference.',
        ' Data Analyst: Analyzes data to inform decisions, offering a stable income and remote work opportunities.',
        ' Freelance Web Developer: Builds websites and web applications, allowing for flexible hours and a mix of independent and collaborative work.',
        ' Cybersecurity Analyst: Protects computer systems from threats, utilizing your problem-solving skills and contributing to a stable infrastructure.',
        ' Technical Writer: Creates clear and concise documentation for software, using your organizational skills and benefiting from remote work opportunities.',
        ' Project Manager (Tech): Leads software development teams, allowing you to help others achieve goals and maintain a stable income.\n'
      ];
    res.render("quiz/response.ejs", { careerList });
});

app.get("/test2", (req, res) => {
    let info = [
        'Skills Required: Strong coding skills are essential, encompassing languages like Java, Python, C++, and JavaScript.  A deep understanding of data structures and algorithms is crucial for efficient code development and problem-solving.  Network security fundamentals, including TCP/IP, firewalls, intrusion detection systems, and VPNs, are also vital.  Furthermore, cybersecurity analysts need exceptional problem-solving abilities to diagnose and mitigate security threats effectively.  Analytical thinking, attention to detail, and the ability to work both independently and collaboratively within a team are paramount.  Excellent communication skills, both written and verbal, are necessary for reporting vulnerabilities and collaborating with other teams.  Familiarity with various security tools and technologies such as SIEM systems, vulnerability scanners, and penetration testing tools is highly beneficial. ',
        'Job Market Demand & Stability: The cybersecurity field is experiencing rapid growth, driven by increasing cyber threats and the growing reliance on technology across all sectors.  Industry reports consistently predict a high demand for cybersecurity analysts for the foreseeable future.  This robust demand translates into significant job stability and numerous career opportunities, both in established organizations and emerging tech companies.  The increasing sophistication of cyberattacks further fuels the need for skilled professionals, ensuring continued growth in this career path. The demand is expected to remain high as businesses invest more in cybersecurity infrastructure and defense. ',
        'Salary & Financial Stability:  Entry-level cybersecurity analyst positions typically offer salaries ranging from $60,000 to $80,000 annually, depending on location, education, and experience.  Mid-level analysts can earn between $80,000 and $120,000, while senior-level analysts with extensive experience and specialized skills can command salaries exceeding $150,000.  Financial stability in this field is high due to the consistent demand and competitive compensation packages offered to attract and retain skilled professionals. Geographic location plays a crucial role in determining salary, with tech hubs typically offering higher compensation. ',
        'Work-Life Balance: The work-life balance for a cybersecurity analyst can vary considerably, depending on the organization, project urgency, and specific responsibilities.  While some roles may require extended hours during critical incidents or project deadlines, many organizations are increasingly prioritizing employee well-being and offering flexible work arrangements to maintain a healthy work-life balance.  The nature of the work, often involving responding to real-time security threats, can lead to occasional periods of high stress, but many companies are implementing strategies to mitigate this. The availability of remote work opportunities is also on the rise within the industry. ',
        'Career Growth & Advancement:  The career path for a cybersecurity analyst offers significant potential for advancement.  Analysts can progress to senior analyst roles, team lead positions, or specialize in areas like penetration testing, incident response, or security architecture.  With further experience and advanced certifications, individuals can move into management positions, overseeing larger security teams or leading security initiatives for an entire organization.  The ever-evolving nature of cybersecurity creates ongoing opportunities for specialization and career progression, including emerging fields like cloud security and AI-driven security solutions. ',
        "Educational & Training Requirements:  A bachelor's degree in computer science, information security, or a related field is typically required for a cybersecurity analyst position.  However, relevant experience and certifications can sometimes compensate for a lack of a formal degree.  Continuous learning and skill development are essential in this rapidly changing field.  Obtaining industry-recognized certifications, such as CompTIA Security+, Certified Ethical Hacker (CEH), or Certified Information Systems Security Professional (CISSP), significantly enhances career prospects and demonstrates a commitment to professional growth.  Many employers value practical experience gained through internships or personal projects.  Further postgraduate studies, such as a master's degree, can provide a competitive edge and open doors to more senior roles. ",    
        'Job Security & Risk:  Cybersecurity analysts enjoy relatively high job security due to the consistently high demand for their skills.  Automation, while impacting some sectors, is unlikely to render cybersecurity analysts obsolete.  Instead, automation is creating more opportunities in this field as more tools and systems require security management and monitoring.  The risk of job displacement is minimal as long as professionals keep their skills current and adapt to emerging threats and technologies.  However, economic downturns could affect hiring in some organizations, although the demand for cybersecurity professionals is expected to remain relatively resilient even during such periods.\n',
        'Cybersecurity Analyst'
    ];
    res.render("quiz/career.ejs", { info });
});

app.post("/career/:career", async(req, res) => {
    let { career } = req.params;
    console.log("req recieved for " + career);
    try {
        // Prepare the prompt
        const prompt2 = `**Task:** Generate a detailed string containing specific information about a single career option provided by the user. The string should be formatted for a career guidance application and adhere to the following structure:

* **Hash-separated parameters:** Each of the given 7 parameters must be separated by a hash symbol (#).  **Do not use hash symbols within the content of each parameter.**
* **Parameter Name: Information format:** Each parameter entry must follow the format "Parameter Name: Detailed information about the parameter."
* **Detailed Information:** The information for each parameter should be descriptive, in a long paragraph form and cover the key aspects. 
* **No additional text:** The output should *only* contain the formatted string. No extra text or explanations are required.

**Career Option:** ${career}

**Desired Output Format:**

Skills Required: Strong coding skills (e.g., Java, Python, JavaScript), problem-solving abilities, understanding of data structures and algorithms, teamwork skills, communication skills; Job Market Demand & Stability: High demand with projected growth in the coming years, offering stable career opportunities; Salary & Financial Stability: Entry-level positions typically range from $60,000-$80,000, while senior engineers can earn upwards of $150,000 or more, providing strong financial stability; Work-Life Balance: Can vary depending on the company and project deadlines, but many companies are prioritizing work-life balance; Career Growth & Advancement: High potential for advancement to senior roles, lead teams, become architects, or move into management positions, with specializations like AI and cybersecurity offering further growth; Educational & Training Requirements: A bachelor's degree in Computer Science or a related field is typically required, along with continuous learning and skill development; Job Security & Risk: Relatively high job security due to strong demand, with minimal risk of job displacement due to automation.


**Example of More Detailed Information (For Guidance):**

For "Skills Required," you could provide examples of specific technologies, programming languages, or tools relevant to the career.

For "Job Market Demand & Stability," you could cite industry reports or statistics indicating the growth potential of the career.

For "Salary & Financial Stability," you could provide ranges for different experience levels and locations.

For "Work-Life Balance," you could discuss typical work hours, flexibility options, and the potential for work-related stress.

For "Career Growth & Advancement," you could outline typical career paths and opportunities for specialization.

For "Educational & Training Requirements," you could mention specific degrees, certifications, or training programs that are beneficial.

For "Job Security & Risk," you could discuss factors that might affect job security, such as technological advancements or economic downturns.

**Remember:** The information provided should be tailored to the specific career option chosen by the user.`;
        // Call Gemini API
        const result = await model.generateContent(prompt2);

        // Extract response text
        const resStr = result.response.text();

        const info = resStr.split('#');

        info.push(`${career}`);
        // Render results page
        res.render("quiz/career.ejs", { info });
    } catch (error) {
        console.error("Error with Gemini API:", error);
        res.send("Error generating career advice. Please try again later.");
    }
});


app.post("/results", async(req, res) => {
    const {field, activities, strongestSkill, improveSkill, motivation, workEnvironment, personality, workStyle, careerGoal, careerChallenges} = req.body;

    try {
        // Prepare the prompt
        const prompt1 = `**Task:** Generate a string containing at least 6 career options, personalized based on the user's responses provided below. The string should adhere to the following structure:
    
        * **Semicolon-separated:** Career options must be separated by semicolons (;).
        * **Title: Description format:** Each career option entry must follow the format "Career Title: Brief, single-line description of the career, tailored to the user's profile."
        * **Minimum 6 options:** The string must contain at least 6 distinct career options.
        * **Concise descriptions:** Descriptions must be brief and limited to a single line.
        * **Focus on diverse fields:** Include a range of career options across different domains (e.g., technology, creative arts, business, healthcare, etc.) to provide a broader perspective.
        * **Personalized:** Each career option and its description must be relevant to the user's provided responses.
        
        **User Responses:**
        
        * **Interests:**
            * Field: ${field}
            * Activities: ${activities}
        * **Skills and Strengths:**
            * Strongest Skill: ${strongestSkill}
            * Skill to Improve: ${improveSkill}
        * **Values and Preferences:**
            * Motivation: ${motivation}
            * Work Environment: ${workEnvironment}
        * **Personality and Traits:**
            * Personality: ${personality}
            * Work Style: ${workStyle}
        * **Career Goals:**
            * Biggest Career Goal: ${careerGoal}
            * Career Challenges: ${careerChallenges}
        
        **Example Output Format (Personalized):**
        
        Software Engineer: Designs and develops innovative software, leveraging your technical skills and interest in problem-solving.; Data Scientist: Analyzes data to extract insights, appealing to your analytical personality and technical abilities.; UX/UI Designer: Creates user-friendly interfaces, combining your technical skills with your interest in design.;  Web Developer: Builds websites and web applications, allowing you to work independently on challenging projects.;  Cybersecurity Analyst: Protects computer systems from threats, aligning with your technical skills and interest in problem-solving.;  Project Manager: Leads software development teams, offering opportunities for leadership and innovation.
        
        **Desired Output:** A single string containing the personalized and formatted career options. No additional text or explanations should be included in the output. The output should be directly usable within a data structure that uses semicolons as separators.`

        // Call Gemini API
        const result = await model.generateContent(prompt1);

        // Extract response text
        const resStr = result.response.text();

        const careerList = resStr.split(';');

        // Render results page
        res.render("quiz/response.ejs", { careerList });
    } catch (error) {
        console.error("Error with Gemini API:", error);
        res.send("Error generating career advice. Please try again later.");
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
