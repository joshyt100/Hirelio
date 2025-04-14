// contact/ContactCard.tsx
import React from "react";
import {
  Mail,
  Phone,
  Briefcase,
  Building,
  Clock,
  Star,
  StarOff,
  LinkedinIcon,
  Twitter,
  MessageSquare,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Contact, interactionTypes, relationshipOptions } from "@/types/ContactTypes";

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onLogInteraction: (contact: Contact) => void;
  onDelete: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onEdit,
  onLogInteraction,
  onDelete,
  toggleFavorite,
}) => {
  // Helper Functions
  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  const getTimeAgo = (date?: Date) => {
    if (!date) return "";
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const getRelationshipLabel = (value: string) =>
    relationshipOptions.find((opt) => opt.value === value)?.label || "Unknown";

  const getInteractionTypeIcon = (type: string) => {
    const interaction = interactionTypes.find((t) => t.value === type);
    const Icon = interaction?.icon || interactionTypes[0].icon;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
              <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                {contact.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={() => toggleFavorite(contact.id)}
                >
                  {contact.isFavorite ? (
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ) : (
                    <StarOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {contact.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  </span>
                </Button>
              </CardTitle>
              <CardDescription className="flex flex-col gap-1 mt-1">
                <span className="flex items-center">
                  <Mail className="h-3.5 w-3.5 mr-1.5" />
                  {contact.email}
                </span>
                {contact.phone && (
                  <span className="flex items-center">
                    <Phone className="h-3.5 w-3.5 mr-1.5" />
                    {contact.phone}
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(contact)}>
                <Edit className="h-4 w-4 mr-2" /> Edit Contact
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLogInteraction(contact)}>
                <MessageSquare className="h-4 w-4 mr-2" /> Log Interaction
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => onDelete(contact.id)}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete Contact
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-3">
          {(contact.company || contact.position) && (
            <div className="flex items-center text-sm">
              <Building className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span>
                {contact.position}
                {contact.position && contact.company && " at "}
                {contact.company}
              </span>
            </div>
          )}
          <div className="flex items-center text-sm">
            <Briefcase className="h-4 w-4 mr-1.5 text-muted-foreground" />
            <span>{getRelationshipLabel(contact.relationship)}</span>
          </div>
          {contact.lastContacted && (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span>Last contacted: {getTimeAgo(contact.lastContacted)}</span>
            </div>
          )}
          {contact.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {contact.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {contact.notes && (
            <div className="mt-3 text-sm">
              <p className="line-clamp-2">{contact.notes}</p>
            </div>
          )}
          {contact.interactions.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Recent Interactions</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                {contact.interactions.slice(0, 3).map((interaction) => (
                  <div
                    key={interaction.id}
                    className="flex gap-2 text-sm border-l-2 border-muted pl-3 py-1"
                  >
                    <div className="flex-shrink-0 mt-0.5">{getInteractionTypeIcon(interaction.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium capitalize">{interaction.type}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(new Date(interaction.date))}
                        </span>
                      </div>
                      <p className="text-xs mt-1 line-clamp-2">{interaction.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(contact)}>
            <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => onLogInteraction(contact)}>
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Log Interaction
          </Button>
          {contact.linkedinUrl && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => window.open(contact.linkedinUrl, "_blank")}
            >
              <LinkedinIcon className="h-4 w-4" />
            </Button>
          )}
          {contact.twitterUrl && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => window.open(contact.twitterUrl, "_blank")}
            >
              <Twitter className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

