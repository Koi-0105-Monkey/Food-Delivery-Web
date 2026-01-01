'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setSent(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <main className="py-12 bg-[#F3F4F6] min-h-screen">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#181C2E] mb-4">Get in Touch</h1>
                    <p className="text-[#878787]">Have a question or feedback? We'd love to hear from you.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-sm">
                            <h3 className="text-xl font-bold text-[#181C2E] mb-6">Contact Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-[#FFF5E6] rounded-full flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-[#FE8C00]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#181C2E]">Phone</h4>
                                        <p className="text-[#878787]">+84 123 456 789</p>
                                        <p className="text-[#878787] text-sm">Mon-Fri 9am-6pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-[#FFF5E6] rounded-full flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-[#FE8C00]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#181C2E]">Email</h4>
                                        <p className="text-[#878787]">support@fooddelivery.com</p>
                                        <p className="text-[#878787] text-sm">Online support 24/7</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-[#FFF5E6] rounded-full flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-[#FE8C00]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#181C2E]">Office</h4>
                                        <p className="text-[#878787]">123 Food Street, District 1</p>
                                        <p className="text-[#878787] text-sm">Ho Chi Minh City, Vietnam</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 rounded-3xl shadow-sm">
                            <h3 className="text-xl font-bold text-[#181C2E] mb-6">Send us a Message</h3>

                            {sent ? (
                                <div className="bg-green-50 text-green-600 p-8 rounded-2xl text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Send className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
                                    <p>Thank you for reaching out. We will get back to you shortly.</p>
                                    <button
                                        onClick={() => setSent(false)}
                                        className="mt-6 text-green-700 font-semibold hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-[#181C2E]">Your Name</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00] transition-colors"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-[#181C2E]">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00] transition-colors"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#181C2E]">Subject</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00] transition-colors"
                                            placeholder="How can we help?"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#181C2E]">Message</label>
                                        <textarea
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00] transition-colors resize-none"
                                            placeholder="Tell us more about your inquiry..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full md:w-auto px-8 py-3 bg-[#FE8C00] text-white rounded-xl font-bold hover:bg-[#E67D00] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
