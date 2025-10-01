import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Progress } from "./components/ui/progress";
import { Star, Trophy, Users, Clock, Target, Sparkles, Home, User, Award } from "lucide-react";
import { toast } from "sonner";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation Component
const Navigation = () => {
  return (
    <nav className="bg-gradient-to-r from-green-400 to-blue-400 shadow-lg" style={{backgroundColor: '#7ED957'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-white rounded-full p-2 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-green-500 flex items-center justify-center text-green-600 font-bold">
                ⏻
              </div>
            </div>
            <span className="text-2xl font-bold text-white">OFF</span>
          </Link>
          
          <div className="flex space-x-6">
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-emerald-100 transition-colors">
              <Home className="h-5 w-5" />
              <span className="hidden sm:block">Accueil</span>
            </Link>
            <Link to="/families" className="flex items-center space-x-2 text-white hover:text-emerald-100 transition-colors">
              <Users className="h-5 w-5" />
              <span className="hidden sm:block">Familles</span>
            </Link>
            <Link to="/leaderboard" className="flex items-center space-x-2 text-white hover:text-emerald-100 transition-colors">
              <Trophy className="h-5 w-5" />
              <span className="hidden sm:block">Classement</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Home Page
const HomePage = () => {
  const [children, setChildren] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [childrenRes, challengesRes] = await Promise.all([
        axios.get(`${API}/children`),
        axios.get(`${API}/challenges`)
      ]);
      setChildren(childrenRes.data);
      setChallenges(challengesRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-4 py-2">
                  ⭐ L'app qui rallume la vraie vie
                </Badge>
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                  Transformez le temps d'écran en 
                  <span className="text-emerald-600"> aventures réelles</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  OFF aide vos enfants à découvrir le plaisir des activités déconnectées 
                  grâce à des défis personnalisés et un système de récompenses motivant.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/children/create">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
                    Commencer l'aventure
                  </Button>
                </Link>
                <Link to="/challenges">
                  <Button variant="outline" size="lg" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg">
                    Découvrir les défis
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1503431153573-96e959f4d9b7" 
                alt="Famille marchant ensemble en plein air"
                className="rounded-3xl shadow-2xl object-cover w-full h-96"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-lg border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <Star className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-gray-900">2,450</p>
                    <p className="text-sm text-gray-600">Crédits Fun gagnés</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            OFF transforme la déconnexion en jeu éducatif avec des défis personnalisés, 
            des récompenses motivantes et un suivi familial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-emerald-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Défis Personnalisés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Des activités adaptées à l'âge et aux centres d'intérêt de chaque enfant, 
                générées par notre IA spécialisée.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368" 
                alt="Enfants jouant au ballon"
                className="rounded-lg mt-4 w-full h-40 object-cover"
              />
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-100 hover:border-amber-300 transition-all duration-300 transform hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-amber-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-amber-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Crédits Fun</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Chaque défi accompli rapporte des points pour débloquer des activités 
                et des récompenses en famille.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1548126466-4470dfd3a209" 
                alt="Personne célébrant un succès"
                className="rounded-lg mt-4 w-full h-40 object-cover"
              />
            </CardContent>
          </Card>

          <Card className="border-2 border-teal-100 hover:border-teal-300 transition-all duration-300 transform hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-teal-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-teal-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Tableau Famille</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Suivez ensemble les progrès, partagez les réussites et renforcez 
                les liens familiaux autour d'activités positives.
              </p>
              <img 
                src="https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb" 
                alt="Famille main dans la main"
                className="rounded-lg mt-4 w-full h-40 object-cover"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      {children.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Vos progrès OFF</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold">{children.length}</div>
                  <p className="text-emerald-100">Enfant{children.length > 1 ? 's' : ''} inscrit{children.length > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <div className="text-3xl font-bold">{challenges.length}</div>
                  <p className="text-emerald-100">Défis disponibles</p>
                </div>
                <div>
                  <div className="text-3xl font-bold">0</div>
                  <p className="text-emerald-100">Crédits Fun gagnés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt à rallumer la vraie vie ?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de familles qui ont déjà transformé leur rapport aux écrans 
            grâce à OFF.
          </p>
          <Link to="/children/create">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              Commencer gratuitement
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Child Creation Page
const CreateChildPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    interests: '',
    screen_time_goal: 60
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      const childData = {
        ...formData,
        age: parseInt(formData.age),
        interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
        screen_time_goal: parseInt(formData.screen_time_goal)
      };

      await axios.post(`${API}/children`, childData);
      toast.success(`${formData.name} a été ajouté avec succès !`);
      navigate('/children');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast.error('Erreur lors de la création de l\'enfant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">Ajouter un enfant</CardTitle>
            <p className="text-emerald-100 mt-2">Créons ensemble le profil de votre enfant</p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg font-medium">Prénom *</Label>
                <Input
                  id="name"
                  data-testid="child-name-input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Lilas, Emile..."
                  className="text-lg p-4"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age" className="text-lg font-medium">Âge *</Label>
                <Input
                  id="age"
                  data-testid="child-age-input"
                  type="number"
                  min="3"
                  max="17"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  placeholder="6"
                  className="text-lg p-4"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interests" className="text-lg font-medium">Centres d'intérêt</Label>
                <Input
                  id="interests"
                  data-testid="child-interests-input"
                  value={formData.interests}
                  onChange={(e) => setFormData({...formData, interests: e.target.value})}
                  placeholder="sport, lecture, musique, nature..."
                  className="text-lg p-4"
                />
                <p className="text-sm text-gray-500">Séparez par des virgules</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="screen_time" className="text-lg font-medium">
                  Objectif temps d'écran (minutes/jour)
                </Label>
                <Input
                  id="screen_time"
                  data-testid="screen-time-input"
                  type="number"
                  min="30"
                  max="300"
                  value={formData.screen_time_goal}
                  onChange={(e) => setFormData({...formData, screen_time_goal: e.target.value})}
                  className="text-lg p-4"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={loading}
                data-testid="create-child-button"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-4"
              >
                {loading ? 'Création...' : 'Créer le profil'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Children List Page
const ChildrenPage = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await axios.get(`${API}/children`);
      setChildren(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement des enfants');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="h-12 w-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Nos petits héros</h1>
          <Link to="/children/create">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-lg px-6 py-3">
              Ajouter un enfant
            </Button>
          </Link>
        </div>

        {children.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">Aucun enfant ajouté</h2>
              <p className="text-gray-500 mb-6">Commencez par ajouter votre premier enfant pour découvrir OFF !</p>
              <Link to="/children/create">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Ajouter mon premier enfant
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map(child => (
              <ChildCard key={child.id} child={child} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Child Card Component
const ChildCard = ({ child }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchChildStats();
  }, []);

  const fetchChildStats = async () => {
    try {
      const response = await axios.get(`${API}/stats/child/${child.id}`);
      setStats(response.data);
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-emerald-100">
      <CardHeader className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-t-lg">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>{child.name}</span>
          <Badge className="bg-white text-emerald-600">{child.age} ans</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <p className="font-medium text-gray-700">Centres d'intérêt:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {child.interests?.length > 0 ? (
                child.interests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="border-emerald-300 text-emerald-700">
                    {interest}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="text-gray-500">Aucun centre d'intérêt</Badge>
              )}
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-700">Objectif écran:</p>
            <p className="text-emerald-600 font-semibold">{child.screen_time_goal} min/jour</p>
          </div>

          {stats && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{stats.total_fun_credits}</div>
                <div className="text-sm text-gray-500">Crédits Fun</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.total_challenges_completed}</div>
                <div className="text-sm text-gray-500">Défis réussis</div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Link to={`/children/${child.id}/challenges`}>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Voir les défis
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Child Challenges Page
const ChildChallengesPage = () => {
  const { childId } = useParams();
  const [child, setChild] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchData();
  }, [childId]);

  const fetchData = async () => {
    try {
      const [childRes, challengesRes] = await Promise.all([
        axios.get(`${API}/children/${childId}`),
        axios.get(`${API}/challenges?age=${10}`) // Will filter by age later
      ]);
      setChild(childRes.data);
      setChallenges(challengesRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const generateChallenge = async (category = null) => {
    setGenerating(true);
    try {
      const response = await axios.post(`${API}/challenges/generate`, {
        child_id: childId,
        category
      });
      
      toast.success('Nouveau défi généré !');
      setChallenges(prev => [response.data, ...prev]);
    } catch (error) {
      console.error('Erreur génération:', error);
      toast.error('Erreur lors de la génération du défi');
    } finally {
      setGenerating(false);
    }
  };

  const completeChallenge = async (challengeId) => {
    try {
      await axios.post(`${API}/challenges/complete`, {
        child_id: childId,
        challenge_id: challengeId,
        validation_method: 'parent'
      });
      
      toast.success('Défi accompli ! Bravo ! 🎉');
    } catch (error) {
      console.error('Erreur completion:', error);
      toast.error('Erreur lors de la validation du défi');
    }
  };

  if (loading || !child) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="h-12 w-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Défis pour {child.name}
          </h1>
          <p className="text-xl text-gray-600">
            {child.age} ans • Objectif: {child.screen_time_goal} min d'écran/jour
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-emerald-600" />
                  Générateur de défis IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    onClick={() => generateChallenge()}
                    disabled={generating}
                    data-testid="generate-challenge-button"
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {generating ? '...' : 'Surprise !'}
                  </Button>
                  <Button
                    onClick={() => generateChallenge('outdoor')}
                    disabled={generating}
                    variant="outline"
                    className="border-green-500 text-green-700 hover:bg-green-50"
                  >
                    Extérieur
                  </Button>
                  <Button
                    onClick={() => generateChallenge('creative')}
                    disabled={generating}
                    variant="outline"
                    className="border-purple-500 text-purple-700 hover:bg-purple-50"
                  >
                    Créatif
                  </Button>
                  <Button
                    onClick={() => generateChallenge('reading')}
                    disabled={generating}
                    variant="outline"
                    className="border-blue-500 text-blue-700 hover:bg-blue-50"
                  >
                    Lecture
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {challenges.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun défi disponible</h3>
                    <p className="text-gray-500 mb-4">Générez le premier défi personnalisé !</p>
                  </CardContent>
                </Card>
              ) : (
                challenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onComplete={() => completeChallenge(challenge.id)}
                    childAge={child.age}
                  />
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <CardContent className="p-6">
                <div className="text-center">
                  <Trophy className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Crédits Fun</h3>
                  <div className="text-3xl font-bold mb-2">0</div>
                  <p className="text-emerald-100">Prêt pour l'aventure !</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progrès du jour</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Défis accomplis</span>
                      <span>0/3</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Temps réel</span>
                      <span>0/{child.screen_time_goal * 2} min</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Challenge Card Component
const ChallengeCard = ({ challenge, onComplete, childAge }) => {
  const isAgeAppropriate = challenge.age_range[0] <= childAge && childAge <= challenge.age_range[1];
  
  const categoryColors = {
    reading: 'bg-blue-100 text-blue-800 border-blue-200',
    outdoor: 'bg-green-100 text-green-800 border-green-200',
    creative: 'bg-purple-100 text-purple-800 border-purple-200',
    family: 'bg-pink-100 text-pink-800 border-pink-200',
    sport: 'bg-orange-100 text-orange-800 border-orange-200',
    learning: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  };

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${!isAgeAppropriate ? 'opacity-75' : ''}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 flex-1 mr-4">
            {challenge.title}
          </h3>
          <div className="flex gap-2">
            <Badge className={categoryColors[challenge.category] || 'bg-gray-100 text-gray-800'}>
              {challenge.category}
            </Badge>
            <Badge className={difficultyColors[challenge.difficulty] || 'bg-gray-100 text-gray-800'}>
              {challenge.difficulty}
            </Badge>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{challenge.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{challenge.duration_minutes} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold text-emerald-600">
                {challenge.fun_credits} crédits
              </span>
            </div>
          </div>

          <Button
            onClick={onComplete}
            data-testid={`complete-challenge-${challenge.id}`}
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={!isAgeAppropriate}
          >
            J'ai réussi !
          </Button>
        </div>

        {!isAgeAppropriate && (
          <p className="text-sm text-amber-600 mt-2">
            Ce défi est recommandé pour {challenge.age_range[0]}-{challenge.age_range[1]} ans
          </p>
        )}
      </CardContent>
    </Card>
  );
};

// Families Page
const FamiliesPage = () => {
  const [families, setFamilies] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      const response = await axios.get(`${API}/families`);
      setFamilies(response.data);
    } catch (error) {
      console.error('Erreur familles:', error);
      toast.error('Erreur lors du chargement des familles');
    } finally {
      setLoading(false);
    }
  };

  const createFamily = async (e) => {
    e.preventDefault();
    if (!newFamilyName.trim()) {
      toast.error('Veuillez entrer un nom de famille');
      return;
    }

    try {
      const response = await axios.post(`${API}/families`, {
        name: newFamilyName.trim()
      });
      
      setFamilies(prev => [...prev, response.data]);
      setNewFamilyName('');
      setShowCreateForm(false);
      toast.success('Famille créée avec succès !');
    } catch (error) {
      console.error('Erreur création famille:', error);
      toast.error('Erreur lors de la création de la famille');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="h-12 w-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Nos familles OFF</h1>
          <Button
            onClick={() => setShowCreateForm(true)}
            data-testid="create-family-button"
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Créer une famille
          </Button>
        </div>

        {showCreateForm && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <form onSubmit={createFamily} className="flex gap-4">
                <Input
                  value={newFamilyName}
                  onChange={(e) => setNewFamilyName(e.target.value)}
                  placeholder="Nom de la famille..."
                  data-testid="family-name-input"
                  className="flex-1"
                />
                <Button type="submit" data-testid="submit-family-button">
                  Créer
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewFamilyName('');
                  }}
                >
                  Annuler
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {families.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">Aucune famille créée</h2>
              <p className="text-gray-500 mb-6">Créez votre première famille pour commencer l'aventure OFF !</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {families.map(family => (
              <FamilyCard key={family.id} family={family} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Family Card Component
const FamilyCard = ({ family }) => {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <span>{family.name}</span>
          <Users className="h-6 w-6" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-indigo-600">{family.children.length}</div>
              <div className="text-sm text-gray-500">Enfants</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{family.total_fun_credits}</div>
              <div className="text-sm text-gray-500">Crédits Fun</div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-3">Temps cette semaine:</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Écran: {Math.floor(family.weekly_screen_time / 60)}h {family.weekly_screen_time % 60}m</span>
                <span>Réel: {Math.floor(family.weekly_real_time / 60)}h {family.weekly_real_time % 60}m</span>
              </div>
              <Progress 
                value={family.weekly_real_time / (family.weekly_screen_time + family.weekly_real_time + 1) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Leaderboard Page  
const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API}/leaderboard`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Erreur leaderboard:', error);
      toast.error('Erreur lors du chargement du classement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Trophy className="h-12 w-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Classement des familles OFF
          </h1>
          <p className="text-xl text-gray-600">
            Les héros de la déconnexion cette semaine
          </p>
        </div>

        {leaderboard.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">Classement vide</h2>
              <p className="text-gray-500">Les premières familles à compléter des défis apparaîtront ici !</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <Card 
                key={entry.family_id} 
                className={`hover:shadow-lg transition-all duration-300 ${
                  index < 3 ? 'border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-amber-600' : 'bg-emerald-500'
                      }`}>
                        {index < 3 ? (
                          <Trophy className="h-6 w-6" />
                        ) : (
                          entry.rank
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {entry.family_name}
                        </h3>
                        <p className="text-gray-600">
                          {entry.weekly_challenges} défi{entry.weekly_challenges > 1 ? 's' : ''} cette semaine
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600">
                        {entry.total_credits}
                      </div>
                      <div className="text-sm text-gray-500">Crédits Fun</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                Rejoignez le classement !
              </h2>
              <p className="text-emerald-100 mb-6">
                Complétez des défis en famille et gravissez les échelons du classement OFF.
              </p>
              <Link to="/children/create">
                <Button className="bg-white text-emerald-600 hover:bg-gray-100">
                  Commencer l'aventure
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/children" element={<ChildrenPage />} />
          <Route path="/children/create" element={<CreateChildPage />} />
          <Route path="/children/:childId/challenges" element={<ChildChallengesPage />} />
          <Route path="/families" element={<FamiliesPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;