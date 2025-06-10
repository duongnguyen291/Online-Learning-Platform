import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
} from '@mui/material';

const LearningPathSuggestion = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [preferences, setPreferences] = useState({
    interests: [],
    difficulty: 'beginner',
    preferredLearningStyle: 'visual',
    availableTimePerWeek: 10,
    goals: []
  });
  const [openPreferences, setOpenPreferences] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    // Load user preferences when component mounts
    const loadUserPreferences = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/knowledge`);
        if (response.data.learningPreferences) {
          setPreferences(response.data.learningPreferences);
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
      }
    };

    loadUserPreferences();
  }, [userId]);

  const handleGetSuggestion = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/rag/suggest-learning-path/${userId}`);
      setSuggestion(response.data);
    } catch (error) {
      console.error('Error getting learning path suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      await axios.patch(`/api/users/${userId}/knowledge`, {
        learningPreferences: preferences
      });
      setOpenPreferences(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const handleAddInterest = () => {
    if (newInterest && !preferences.interests.includes(newInterest)) {
      setPreferences({
        ...preferences,
        interests: [...preferences.interests, newInterest]
      });
      setNewInterest('');
    }
  };

  const handleAddGoal = () => {
    if (newGoal && !preferences.goals.includes(newGoal)) {
      setPreferences({
        ...preferences,
        goals: [...preferences.goals, newGoal]
      });
      setNewGoal('');
    }
  };

  const handleRemoveInterest = (interest) => {
    setPreferences({
      ...preferences,
      interests: preferences.interests.filter(i => i !== interest)
    });
  };

  const handleRemoveGoal = (goal) => {
    setPreferences({
      ...preferences,
      goals: preferences.goals.filter(g => g !== goal)
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Learning Path Suggestion
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenPreferences(true)}
          sx={{ mb: 2 }}
        >
          Update Learning Preferences
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleGetSuggestion}
          sx={{ ml: 2, mb: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Get Learning Path Suggestion'}
        </Button>

        {suggestion && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Suggested Learning Path
              </Typography>
              <Typography variant="body1" component="div">
                {suggestion.recommendation}
              </Typography>
              
              {suggestion.sources && suggestion.sources.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Related Resources:
                  </Typography>
                  <List>
                    {suggestion.sources.map((source, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={source.metadata.filename || 'Resource'}
                          secondary={source.content}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        <Dialog open={openPreferences} onClose={() => setOpenPreferences(false)} maxWidth="md" fullWidth>
          <DialogTitle>Learning Preferences</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  value={preferences.difficulty}
                  label="Difficulty Level"
                  onChange={(e) => setPreferences({ ...preferences, difficulty: e.target.value })}
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Preferred Learning Style</InputLabel>
                <Select
                  value={preferences.preferredLearningStyle}
                  label="Preferred Learning Style"
                  onChange={(e) => setPreferences({ ...preferences, preferredLearningStyle: e.target.value })}
                >
                  <MenuItem value="visual">Visual</MenuItem>
                  <MenuItem value="auditory">Auditory</MenuItem>
                  <MenuItem value="reading">Reading</MenuItem>
                  <MenuItem value="kinesthetic">Kinesthetic</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="number"
                label="Available Hours per Week"
                value={preferences.availableTimePerWeek}
                onChange={(e) => setPreferences({ ...preferences, availableTimePerWeek: parseInt(e.target.value) })}
                sx={{ mb: 2 }}
              />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Interests
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  {preferences.interests.map((interest, index) => (
                    <Chip
                      key={index}
                      label={interest}
                      onDelete={() => handleRemoveInterest(interest)}
                    />
                  ))}
                </Stack>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    label="Add Interest"
                    size="small"
                  />
                  <Button variant="outlined" onClick={handleAddInterest}>
                    Add
                  </Button>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Learning Goals
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  {preferences.goals.map((goal, index) => (
                    <Chip
                      key={index}
                      label={goal}
                      onDelete={() => handleRemoveGoal(goal)}
                    />
                  ))}
                </Stack>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    label="Add Goal"
                    size="small"
                  />
                  <Button variant="outlined" onClick={handleAddGoal}>
                    Add
                  </Button>
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPreferences(false)}>Cancel</Button>
            <Button onClick={handleSavePreferences} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default LearningPathSuggestion; 