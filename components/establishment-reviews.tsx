"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ThumbsUp, Flag } from "lucide-react"
import { useUser } from "@/contexts/user-context"

// Mock data for reviews
const mockReviews = [
  {
    id: "1",
    user: {
      name: "Aurnela Rakoto",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    date: "15 mars 2023",
    content:
      "Excellente université avec des professeurs compétents et disponibles. Les infrastructures sont modernes et bien entretenues. Je recommande vivement cette université pour la qualité de son enseignement et son environnement stimulant.",
    likes: 24,
    liked: false,
  },
  {
    id: "2",
    user: {
      name: "Fitiavana Rabe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 4,
    date: "2 février 2023",
    content:
      "Très bonne expérience globale. Les cours sont intéressants et les professeurs sont qualifiés. Seul bémol : certaines salles mériteraient d'être rénovées. La bibliothèque est bien fournie et le campus est agréable.",
    likes: 15,
    liked: false,
  },
  {
    id: "3",
    user: {
      name: "Sophie Randria",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 3,
    date: "18 décembre 2022",
    content:
      "Expérience mitigée. Les cours sont de bonne qualité mais l'administration est parfois compliquée à joindre. Le restaurant universitaire propose une nourriture correcte à prix abordable.",
    likes: 8,
    liked: false,
  },
  {
    id: "4",
    user: {
      name: "Lucas Andria",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    date: "5 novembre 2022",
    content:
      "Je suis très satisfait de ma formation. Les enseignements sont de qualité et les opportunités professionnelles nombreuses. L'ambiance sur le campus est studieuse mais conviviale.",
    likes: 32,
    liked: false,
  },
]

interface EstablishmentReviewsProps {
  establishmentId: string
}

export function EstablishmentReviews({ establishmentId }: EstablishmentReviewsProps) {
  const { user } = useUser()
  const [reviews, setReviews] = useState(mockReviews)
  const [newReview, setNewReview] = useState("")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleLike = (reviewId: string) => {
    setReviews(
      reviews.map((review) => {
        if (review.id === reviewId) {
          const newLiked = !review.liked
          return {
            ...review,
            likes: newLiked ? review.likes + 1 : review.likes - 1,
            liked: newLiked,
          }
        }
        return review
      }),
    )
  }

  const handleSubmitReview = () => {
    if (newReview.trim() && rating > 0) {
      const newReviewObj = {
        id: Date.now().toString(),
        user: {
          name: user?.name || "Utilisateur anonyme",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        rating,
        date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
        content: newReview,
        likes: 0,
        liked: false,
      }

      setReviews([newReviewObj, ...reviews])
      setNewReview("")
      setRating(0)
    }
  }

  return (
    <div className="space-y-6">
      {user && (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-medium mb-4">Partagez votre expérience</h3>

            <div className="flex items-center mb-4">
              <p className="text-sm mr-2">Votre note :</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= (hoveredRating || rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Partagez votre avis sur cet établissement..."
              className="mb-4"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
            />

            <div className="flex justify-end">
              <Button onClick={handleSubmitReview} disabled={!newReview.trim() || rating === 0}>
                Publier
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.user.avatar} alt={review.user.name} />
                  <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-medium">{review.user.name}</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm mb-4">{review.content}</p>

                  <div className="flex items-center gap-4">
                    <button
                      className={`flex items-center gap-1 text-sm ${
                        review.liked ? "text-primary" : "text-muted-foreground"
                      }`}
                      onClick={() => handleLike(review.id)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{review.likes}</span>
                    </button>

                    <button className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Flag className="h-4 w-4" />
                      <span>Signaler</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

