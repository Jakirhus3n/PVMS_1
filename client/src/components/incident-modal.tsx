import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Calendar, UserX, Users, Bot, ExternalLink, X } from "lucide-react";
import type { Incident } from "@shared/schema";

interface IncidentModalProps {
  incident: Incident;
  onClose: () => void;
}

export default function IncidentModal({ incident, onClose }: IncidentModalProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-600 text-white';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high': return 'উচ্চ তীব্রতা';
      case 'medium': return 'মধ্যম তীব্রতা';
      case 'low': return 'নিম্ন তীব্রতা';
      default: return 'অজানা তীব্রতা';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'very_negative': return 'অত্যন্ত নেতিবাচক';
      case 'negative': return 'নেতিবাচক';
      case 'neutral': return 'নিরপেক্ষ';
      case 'positive': return 'ইতিবাচক';
      default: return 'অজানা';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            ঘটনার বিস্তারিত তথ্য
            <Badge className={getSeverityColor(incident.severity)}>
              {getSeverityLabel(incident.severity)}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Location & Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">স্থান ও সময়</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{incident.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{new Date(incident.date).toLocaleDateString('bn-BD')}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <p>বিভাগ: {incident.division} | জেলা: {incident.district}</p>
                    <p>উপজেলা: {incident.upazila} | থানা: {incident.policeStation}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">হতাহতের সংখ্যা</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{incident.killed}</div>
                    <div className="text-xs text-red-700">নিহত</div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">{incident.injured}</div>
                    <div className="text-xs text-orange-700">আহত</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">রাজনৈতিক তথ্য</h4>
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-center py-2">
                    {incident.party}
                  </Badge>
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    <p><strong>সহিংসতার ধরণ:</strong> {incident.aiAnalysis.extractedInfo.violenceType}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">সূত্র ও বিশ্বস্ততা</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>নিউজ সূত্র:</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{incident.newsSource}</Badge>
                      {incident.sourceUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={incident.sourceUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>AI নির্ভরযোগ্যতা:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={incident.aiAnalysis.confidence * 100} className="w-16 h-2" />
                      <span className="text-xs">{Math.round(incident.aiAnalysis.confidence * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2">ঘটনার বিবরণ</h4>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
              {incident.description}
            </p>
          </div>
          
          {/* AI Analysis */}
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2">AI বিশ্লেষণ</h4>
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>মূল শব্দ:</strong> {incident.aiAnalysis.keyEntities.join(', ')}</p>
                  <p><strong>আবেগ বিশ্লেষণ:</strong> {getSentimentLabel(incident.aiAnalysis.sentiment)}</p>
                </div>
                <div>
                  <p><strong>স্থান নির্ভরযোগ্যতা:</strong> {Math.round(incident.aiAnalysis.extractedInfo.locationConfidence * 100)}%</p>
                  <p><strong>দল নির্ভরযোগ্যতা:</strong> {Math.round(incident.aiAnalysis.extractedInfo.partyConfidence * 100)}%</p>
                </div>
              </div>
              <div className="text-xs text-blue-700">
                <p>প্রক্রিয়াকৃত: {new Date(incident.aiAnalysis.processedAt).toLocaleString('bn-BD')}</p>
              </div>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {incident.witnesses && incident.witnesses.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">প্রত্যক্ষদর্শী</h4>
                <div className="space-y-1">
                  {incident.witnesses.map((witness, idx) => (
                    <Badge key={idx} variant="secondary" className="mr-2 mb-1">
                      {witness}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {incident.policeResponse && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">পুলিশের পদক্ষেপ</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {incident.policeResponse}
                </p>
              </div>
            )}
          </div>
          
          {/* Tags */}
          {incident.tags && incident.tags.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">ট্যাগ</h4>
              <div className="flex flex-wrap gap-2">
                {incident.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Images */}
          {incident.images && incident.images.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">সংগৃহীত ছবি</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incident.images.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`Incident image ${idx + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Metadata */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
              <div>
                <strong>ক্রল করা হয়েছে:</strong><br />
                {new Date(incident.crawledAt).toLocaleString('bn-BD')}
              </div>
              <div>
                <strong>সর্বশেষ আপডেট:</strong><br />
                {new Date(incident.lastUpdated).toLocaleString('bn-BD')}
              </div>
              <div>
                <strong>আইডি:</strong> {incident.id}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
