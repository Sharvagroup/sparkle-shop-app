import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, Users, Shield, ShieldCheck, ShieldX, Mail, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface TeamMember {
  id: string;
  user_id: string;
  role: "admin" | "customer";
  is_verified: boolean;
  created_at: string;
  profile?: {
    full_name: string | null;
    phone: string | null;
  };
  email?: string;
}

const Team = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select(`
          *,
          profile:profiles(full_name, phone)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as TeamMember[];
    },
  });

  const verifyAdmin = useMutation({
    mutationFn: async ({ userId, verify }: { userId: string; verify: boolean }) => {
      // This would need a proper admin-level function to update is_verified
      // For now, we'll show a toast explaining this requires manual DB update
      throw new Error("Admin verification requires database-level access");
    },
    onError: (error) => {
      toast({ 
        title: "Admin Verification", 
        description: "Verification status can only be changed directly in the database for security.",
        variant: "destructive"
      });
    },
  });

  const filteredMembers = members.filter((member) =>
    member.profile?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    member.role.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = members.filter((m) => m.role === "admin").length;
  const verifiedAdminCount = members.filter((m) => m.role === "admin" && m.is_verified).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team</h1>
          <p className="text-muted-foreground">Manage admin users and their permissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">Total Users</span>
          </div>
          <p className="text-2xl font-bold mt-2">{members.length}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span className="text-sm">Admins</span>
          </div>
          <p className="text-2xl font-bold mt-2">{adminCount}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-sm">Verified Admins</span>
          </div>
          <p className="text-2xl font-bold mt-2">{verifiedAdminCount}</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search team members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  {Array(5).fill(0).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No team members found
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{member.profile?.full_name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{member.profile?.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={member.role === "admin" ? "default" : "secondary"}
                      className="gap-1"
                    >
                      {member.role === "admin" ? <Shield className="h-3 w-3" /> : null}
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.role === "admin" ? (
                      member.is_verified ? (
                        <Badge className="bg-green-500/10 text-green-600 gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 gap-1">
                          <ShieldX className="h-3 w-3" />
                          Pending
                        </Badge>
                      )
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(member.created_at), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMember(member)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Member Details Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Team Member Details</DialogTitle>
            <DialogDescription>View and manage team member information</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedMember.profile?.full_name || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedMember.profile?.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge variant={selectedMember.role === "admin" ? "default" : "secondary"}>
                    {selectedMember.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verification</p>
                  {selectedMember.is_verified ? (
                    <Badge className="bg-green-500/10 text-green-600">Verified</Badge>
                  ) : (
                    <Badge variant="outline" className="text-orange-600">Pending</Badge>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  To verify/unverify an admin, update the <code>is_verified</code> field in the <code>user_roles</code> table directly in Supabase.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Team;
