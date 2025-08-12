'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardContent, CardTag } from '@/components/ui/Card';
import { Search, Briefcase, Users, Star, ArrowRight, CheckCircle, Zap, Shield, Heart } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="qg-hero bg-gradient-to-br from-qg-primary via-qg-primary-dark to-qg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="qg-container relative z-10 py-20 lg:py-32">
          <div className="text-center animate-qg-fade-in">
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Kahit saan sa Pinas,
              <span className="block text-qg-accent drop-shadow-lg">may gig para sa'yo!</span>
            </h1>
            <p className="font-body text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Ang pinakamabilis na paraan para makahanap ng trabaho o mag-hire ng skilled professionals. 
              Dito sa QuickGig.ph, madali lang!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link href="/signup">
                    <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                      Simulan Na!
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/find-work">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-qg-navy">
                      Browse Jobs
                      <Search className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/find-work">
                    <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                      Find Work
                      <Search className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/post-job">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-qg-navy">
                      Post a Job
                      <Briefcase className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-white/80">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-qg-accent" />
                First ticket? Libre 'yan!
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-qg-accent" />
                Verified Filipino professionals
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-qg-accent" />
                Secure payments
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="qg-container">
          <div className="text-center mb-16 animate-qg-slide-up">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-qg-navy mb-4">
              Bakit QuickGig.ph ang pinakamabuti?
            </h2>
            <p className="font-body text-xl text-gray-600 max-w-2xl mx-auto">
              Ginawa namin itong simple, mabilis, at secure para sa lahat ng Pinoy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card hover className="text-center">
              <CardContent>
                <div className="bg-qg-primary/10 w-16 h-16 rounded-qg-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-qg-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-qg-navy mb-3">Super Bilis na Search</h3>
                <p className="font-body text-gray-600">
                  Hanapin mo agad ang perfect gig gamit ang aming smart search. Filter by category, location, at bayad.
                </p>
              </CardContent>
            </Card>

            <Card hover className="text-center">
              <CardContent>
                <div className="bg-qg-accent/20 w-16 h-16 rounded-qg-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-qg-accent" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-qg-navy mb-3">Verified na Profiles</h3>
                <p className="font-body text-gray-600">
                  Makipag-connect sa mga verified professionals at employers. May rating system pa para sa trust.
                </p>
              </CardContent>
            </Card>

            <Card hover className="text-center">
              <CardContent>
                <div className="bg-qg-primary/10 w-16 h-16 rounded-qg-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-qg-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-qg-navy mb-3">Para sa Pinoy, Gawa ng Pinoy</h3>
                <p className="font-body text-gray-600">
                  Ginawa namin ito specifically para sa Filipino freelancers at employers. Gets namin ang needs ninyo!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="qg-container">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-qg-navy mb-4">
              Paano Gumagana?
            </h2>
            <p className="font-body text-xl text-gray-600">
              Madaling-madali lang, promise!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* For Job Seekers */}
            <Card padding="lg">
              <CardHeader variant="primary">
                <h3 className="font-heading text-2xl font-bold text-center">Para sa mga Job Seekers</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-qg-primary text-white rounded-qg-full w-10 h-10 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-qg-navy mb-2">Gumawa ng Profile</h4>
                      <p className="font-body text-gray-600">Sign up at ipakita ang skills, experience, at portfolio mo. First ticket libre!</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-qg-primary text-white rounded-qg-full w-10 h-10 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-qg-navy mb-2">Browse at Mag-apply</h4>
                      <p className="font-body text-gray-600">Hanapin ang mga gig na swak sa skills mo at mag-apply agad. Walang hassle!</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-qg-primary text-white rounded-qg-full w-10 h-10 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-qg-navy mb-2">Ma-hire at Kumita!</h4>
                      <p className="font-body text-gray-600">Makipag-connect sa employers at simulan ang exciting projects. Kita na!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Employers */}
            <Card padding="lg">
              <CardHeader variant="accent">
                <h3 className="font-heading text-2xl font-bold text-center">Para sa mga Employers</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-qg-accent text-qg-navy rounded-qg-full w-10 h-10 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-qg-navy mb-2">Post ng Job</h4>
                      <p className="font-body text-gray-600">I-describe ang project requirements at budget mo. Ilang minutes lang!</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-qg-accent text-qg-navy rounded-qg-full w-10 h-10 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-qg-navy mb-2">Review ng Applications</h4>
                      <p className="font-body text-gray-600">Tignan ang mga qualified candidates at i-review ang profiles nila.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-qg-accent text-qg-navy rounded-qg-full w-10 h-10 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-qg-navy mb-2">Hire at Mag-collaborate</h4>
                      <p className="font-body text-gray-600">Piliin ang best talent at simulan agad ang project. Tapos na!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-qg-navy text-white">
        <div className="qg-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-qg-accent mb-2">1000+</div>
              <div className="font-body text-white/80">Active Freelancers</div>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-qg-accent mb-2">500+</div>
              <div className="font-body text-white/80">Jobs Posted</div>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-qg-accent mb-2">₱2M+</div>
              <div className="font-body text-white/80">Total Earnings</div>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-qg-accent mb-2">4.8★</div>
              <div className="font-body text-white/80">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-qg-primary to-qg-primary-dark">
        <div className="qg-container text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Ready ka na ba mag-start?
          </h2>
          <p className="font-body text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Sumali na sa libu-libong Pinoy na gumagamit ng QuickGig.ph para makahanap ng work at mag-hire ng talent.
          </p>
          {!isAuthenticated && (
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Sign Up Na!
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
