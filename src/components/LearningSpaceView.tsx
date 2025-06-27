import React from 'react';
import { BookOpen, Play, Clock, Star } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface LearningSpaceViewProps {
  user: User | null;
}

export function LearningSpaceView({ user }: LearningSpaceViewProps) {
  const courses = [
    {
      id: 1,
      title: 'Introduction to React',
      description: 'Learn the fundamentals of React development',
      duration: '4 hours',
      rating: 4.8,
      progress: 60,
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      id: 2,
      title: 'JavaScript ES6+',
      description: 'Modern JavaScript features and best practices',
      duration: '6 hours',
      rating: 4.9,
      progress: 30,
      thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
    {
      id: 3,
      title: 'Database Design',
      description: 'Learn how to design efficient databases',
      duration: '5 hours',
      rating: 4.7,
      progress: 0,
      thumbnail: 'https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?auto=compress&cs=tinysrgb&w=300',
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Space</h1>
          <p className="text-gray-600">Continue your learning journey with personalized courses</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-gray-600">Courses Enrolled</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">48h</p>
                <p className="text-gray-600">Learning Time</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-gray-600">Certificates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{course.duration}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{course.rating}</span>
                  </div>
                </div>

                {course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>{course.progress > 0 ? 'Continue' : 'Start Course'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}