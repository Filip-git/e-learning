import React, { useState, useEffect } from 'react';
import { addDoc, collection, doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firestore } from '../utils/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Development');
  const [slides, setSlides] = useState(['']);
  const [quiz, setQuiz] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: '' },
  ]);
  const [user, setUser] = useState(null);

  const categories = ['Development', 'Design', 'Marketing', 'Business', 'Photography', 'Sport', 'Music'];

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        uid: currentUser.uid,
        email: currentUser.email,
        username: currentUser.displayName || currentUser.email.split('@')[0],
      });
    }
  }, []);

  const handleSlideChange = (index, value) => {
    const newSlides = [...slides];
    newSlides[index] = value;
    setSlides(newSlides);
  };

  const addSlide = () => setSlides([...slides, '']);
  const removeSlide = (index) => setSlides(slides.filter((_, i) => i !== index));

  const handleQuestionChange = (index, value) => {
    const newQuiz = [...quiz];
    newQuiz[index].question = value;
    setQuiz(newQuiz);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuiz = [...quiz];
    newQuiz[qIndex].options[oIndex] = value;
    setQuiz(newQuiz);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const newQuiz = [...quiz];
    newQuiz[qIndex].correctAnswer = value;
    setQuiz(newQuiz);
  };

  const addQuestion = () => setQuiz([...quiz, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  const removeQuestion = (index) => setQuiz(quiz.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error('User not authenticated');
      return;
    }

    if (!title.trim() || !description.trim() || !category.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    const courseData = {
      title,
      description,
      category,
      slides,
      quiz,
      createdBy: user.username,
      createdByUid: user.uid,
      createdAt: new Date(),
    };

    try {
      const docRef = await addDoc(collection(firestore, 'courses'), courseData);

      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, { courses: [], courseCount: 0 });
      }

      const userDocData = userDocSnap.exists() ? userDocSnap.data() : { courseCount: 0 };
      const newCourseCount = userDocData.courseCount + 1;

      await updateDoc(userDocRef, {
        courses: arrayUnion({ courseId: docRef.id, title: courseData.title }),
        courseCount: newCourseCount,
      });

      console.log('Course added with ID: ', docRef.id);
      toast.success('Course added successfully!');

      setTitle('');
      setDescription('');
      setCategory('Development');
      setSlides(['']);
      setQuiz([{ question: '', options: ['', '', '', ''], correctAnswer: '' }]);
    } catch (e) {
      console.error('Error adding document: ', e);
      toast.error('Failed to add course.');
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white shadow-md rounded-md max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
        Add New Course
      </h1>
      <button type="submit" className="w-full p-3 bg-green-600 text-white text-lg font-semibold rounded-md hover:bg-green-700">
        Create Course
      </button>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Course Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          placeholder="Enter course title"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Course Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          placeholder="Enter course description"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Slides</label>
        {slides.map((slide, index) => (
          <div key={index} className="mt-2 flex items-center space-x-2">
            <input
              type="text"
              value={slide}
              onChange={(e) => handleSlideChange(index, e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full"
              placeholder={`Slide ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => removeSlide(index)}
              className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSlide}
          className="mt-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Slide
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Quiz</label>
        {quiz.map((q, qIndex) => (
          <div key={qIndex} className="mt-4 space-y-2">
            <input
              type="text"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full"
              placeholder="Enter quiz question"
            />
            {q.options.map((option, oIndex) => (
              <div key={oIndex} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  className="p-2 border border-gray-300 rounded-md w-full"
                  placeholder={`Option ${oIndex + 1}`}
                />
                <input
                  type="radio"
                  name={`correct-answer-${qIndex}`}
                  checked={q.correctAnswer === option}
                  onChange={() => handleCorrectAnswerChange(qIndex, option)}
                  className="ml-2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => removeQuestion(qIndex)}
              className="mt-2 p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Remove Question
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          className="mt-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Question
        </button>
      </div>
      </form>

<ToastContainer />
</div>
  );
};

export default CourseForm;
