import React from "react";

// ✅ Type for a testimonial object
interface Testimonial {
  name: string;
  title: string;
  testimonial: string;
  image: string;
}

// ✅ Data array typed with Testimonial[]
const testimonials: Testimonial[] = [
  {
    name: "Raj Kumar",
    title: "Student at NIT JSR",
    testimonial:
      "This web app has greatly improved our productivity and efficiency!",
    image:
      "https://cdn.vectorstock.com/i/500p/17/61/male-avatar-profile-picture-vector-10211761.jpg",
  },
  {
    name: "Dr Rajesh Sharma",
    title: "CSE Professor",
    testimonial: "An amazing tool for students. Highly recommend!",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYN4scLAOk6JcRBGzBZrq9N4zSHo6oOB_aycIUGb6FlF48fK8XsTr1a6AJZgMuYrduBeY&usqp=CAU",
  },
  {
    name: "Dr. Shubhi Garg",
    title: "AIIMS Delhi",
    testimonial:
      "Having all resources in one place is very helpful for students.",
    image:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX///8pLTImKi8lKS/8/PwjKC34+PgfJCrNzs8nKzEhJivCw8QqLjM4PEExNTry8vIQFx4cISfa29uytLWtrrCXmZvr7Ozl5eZOUVVaXWCQkpVgY2dHSk6HiYx/gYRydXhAQ0e8vb/e399oa26kpafS09RITFEAAA6Nj5KEhYd2eHsWHCIJEhqnqapTV1qeoKKT9wADAAASYUlEQVR4n...",
  },
];

// ✅ Props interface for TestimonialCard
interface TestimonialCardProps extends Testimonial {}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  title,
  testimonial,
  image,
}) => (
  <div className="max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
    <div className="flex items-center mb-4">
      <img
        className="w-16 h-16 rounded-full object-cover"
        src={image}
        alt={`${name}'s photo`}
      />
      <div className="ml-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-500">{title}</p>
      </div>
    </div>
    <p className="text-gray-700">{testimonial}</p>
  </div>
);

const TestimonialPage: React.FC = () => (
  <div className="bg-white py-12">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-4xl font-extrabold text-center text-gray-900">
        Testimonials
      </h2>
      <p className="mt-4 text-center text-gray-500">
        Hear from our satisfied users
      </p>
      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <TestimonialCard key={t.name + i} {...t} />
        ))}
      </div>
    </div>
  </div>
);

export default TestimonialPage;
