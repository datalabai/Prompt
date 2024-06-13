import React, { useState, useRef } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

const Resume = () => {
  const [copyVisible, setCopyVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const resumeContentRef = useRef(null);

  const handleCopy = () => {
    if (resumeContentRef.current) {
      const resumeContent = resumeContentRef.current.innerText;
      navigator.clipboard.writeText(resumeContent)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
        })
        .catch((error) => console.error('Failed to copy: ', error));
    }
  };

  return (
    <div className="mx-auto pt-4 relative" onMouseEnter={() => setCopyVisible(true)} onMouseLeave={() => setCopyVisible(false)}>
      {!copied && copyVisible && (
        <button
          className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={handleCopy}
        >
          <ContentCopyIcon className="h-6 w-6" />
        </button>
      )}
      {copied && (
        <div className="absolute top-0 right-0 p-2 text-green-500">
          <CheckIcon className="h-6 w-6" />
        </div>
      )}
      <div ref={resumeContentRef}>
      <h1 className="text-2xl font-bold mb-4">Your Name</h1>
      <p className="mb-4">Your Contact Information: Phone Number, Email Address, <a href="Your LinkedIn Profile URL" className="text-blue-500">LinkedIn Profile</a></p>
      
      <h2 className="text-xl font-bold mb-2">Objective:</h2>
      <p className="mb-4">Short statement summarizing your career goals and how they align with Web3 technology.</p>

      <h2 className="text-xl font-bold mb-2">Skills:</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Proficient in blockchain technologies including Ethereum, Solidity, and smart contract development.</li>
        <li>Deep understanding of decentralized applications (DApps) and Web3 protocols.</li>
        <li>Experience with Web3 frameworks such as Web3.js, Ethers.js, and Truffle.</li>
        <li>Strong programming skills in languages like JavaScript, Python, and/or Rust.</li>
        <li>Familiarity with decentralized finance (DeFi) protocols and concepts.</li>
        <li>Excellent problem-solving and analytical abilities.</li>
        <li>Strong communication skills and ability to work in cross-functional teams.</li>
      </ul>

      <h2 className="text-xl font-bold mb-2">Experience:</h2>
      <p>[Job Title] - [Company Name]<br />
      [Dates of Employment]<br />
      Description of responsibilities and achievements, focusing on any projects related to blockchain development, DApps, or decentralized technologies.</p>

      <p>[Job Title] - [Company Name]<br />
      [Dates of Employment]<br />
      Description of responsibilities and achievements, highlighting any contributions to Web3 projects or initiatives.</p>

      <h2 className="text-xl font-bold mb-2">Education:</h2>
      <p>[Degree] in [Field of Study] - [University Name]<br />
      [Dates of Attendance]<br />
      Relevant coursework: List any courses related to blockchain, cryptography, or distributed systems.</p>

      <h2 className="text-xl font-bold mb-2">Certifications:</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>[Certification Name] - [Issuing Organization]</li>
        <li>[Certification Name] - [Issuing Organization]</li>
      </ul>

      <h2 className="text-xl font-bold mb-2">Projects:</h2>
      <p>List any personal or professional projects related to Web3 technology. Include a brief description of each project and your role in its development.</p>

      <h2 className="text-xl font-bold mb-2">Additional Information:</h2>
      <p>Include any other relevant information such as awards, publications, or involvement in the blockchain community.</p>
    </div>
    </div>
  );
};

export default Resume;
