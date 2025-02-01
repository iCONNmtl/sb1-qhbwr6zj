import React from 'react';

const TESTIMONIALS = [
  {
    name: 'Alice Johnson',
    username: '@alicejohnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: "I'm blown away by the versatility of the components in this library. They make UI development a breeze!"
  },
  {
    name: 'David Smith',
    username: '@davidsmith',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: 'Using this component library has significantly speed up our development process. The quality and ease of integration are remarkable!'
  },
  {
    name: 'Emma Brown',
    username: '@emmabrown',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: "The components in this library are not just well-designed but also highly customizable. It's a developer's dream!"
  },
  {
    name: 'James Wilson',
    username: '@jameswilson',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: 'I love how intuitive and well-documented this component library is. It has significantly improved our UI consistency across projects.'
  },
  {
    name: 'Sophia Lee',
    username: '@sophialee',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: "Implementing this component library was a game-changer for our team. It has elevated our product's UI to a whole new level!"
  },
  {
    name: 'Michael Davis',
    username: '@michaeldavis',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
    content: 'Using this library has been a game-changer for our product development.'
  }
];

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Read what people are saying
          </h2>
          <p className="text-gray-600">
            Dummy feedback from virtual customers using our component library.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.username}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.username}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                {testimonial.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}