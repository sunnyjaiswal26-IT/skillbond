import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import api from '../../config/axios';

const ManageUsers = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => (await api.get('/admin/users')).data,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ userId, enabled }) => (await api.put(`/admin/users/${userId}/toggle-status?enabled=${enabled}`)).data,
    onSuccess: () => queryClient.invalidateQueries(['adminUsers']),
  });

  const approveUserMutation = useMutation({
    mutationFn: async ({ userId, approved }) => (await api.put(`/admin/users/${userId}/approve?approved=${approved}`)).data,
    onSuccess: () => queryClient.invalidateQueries(['adminUsers']),
  });

  return (
    <Box maxWidth="lg">
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        Manage Platform Users
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Approve accounts, block malicious users, and inspect roles.
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 4 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Roles</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Approval</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Active Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center"><CircularProgress size={24} /></TableCell>
              </TableRow>
            ) : users && users.length > 0 ? (
              users.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ fontWeight: 700 }}>{row.fullName}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    {row.roles?.map((role) => (
                      <Chip key={role} label={role.replace('ROLE_', '')} size="small" sx={{ mr: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip label={row.approved ? 'APPROVED' : 'PENDING'} color={row.approved ? 'success' : 'warning'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={row.enabled ? 'ACTIVE' : 'BLOCKED'} color={row.enabled ? 'primary' : 'error'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color={row.enabled ? 'error' : 'success'}
                      onClick={() => toggleStatusMutation.mutate({ userId: row.id, enabled: !row.enabled })}
                      sx={{ mr: 1 }}
                    >
                      {row.enabled ? 'Block' : 'Unblock'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">No users registered.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageUsers;
