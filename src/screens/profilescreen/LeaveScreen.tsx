// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useUserStore } from '../../store/useUserStore';
// import { leaveStyles as styles } from './LeaveStyles';

// import {
//   getLeaveContacts,
//   sendLeaveEmail,
// } from '../../api/leave-api/leave_api';
// import { showToast } from '../../utils/ToastHelper';

// export default function LeaveRequestScreen({ navigation }: any) {
//   const { user } = useUserStore();

//   const [loading, setLoading] = useState(true);
//   const [toEmail, setToEmail] = useState('');
//   const [ccEmails, setCcEmails] = useState<string[]>([]);
//   const [subject, setSubject] = useState('');

//   const [leaveType, setLeaveType] = useState('Sick Leave');
//   const [showLeaveType, setShowLeaveType] = useState(false);

//   const [fromDate, setFromDate] = useState(new Date());
//   const [toDate, setToDate] = useState(new Date());
//   const [showFromPicker, setShowFromPicker] = useState(false);
//   const [showToPicker, setShowToPicker] = useState(false);

//   const [body, setBody] = useState('');
//   const [sending, setSending] = useState(false);

//   const updateEmailBody = useCallback(() => {
//     const template = `
// Hi Team,

// I would like to request ${leaveType} from 
// ${fromDate.toDateString()} to ${toDate.toDateString()}.

// Reason:
// (Please specify here)

// Regards,
// ${user?.name}
//     `.trim();

//     setBody(template);
//   }, [leaveType, fromDate, toDate, user?.name]);

//   // Fetch contacts
//   const loadContacts = async () => {
//     try {
//       setLoading(true);
//       const data = await getLeaveContacts();

//       setToEmail(data.to);
//       setCcEmails(data.cc || []);

//       setSubject(`${leaveType} Request - ${user?.name}`);
//     } catch (err: any) {
//       showToast('error', err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadContacts();
//   }, []);

//   useEffect(() => {
//     updateEmailBody();
//   }, [leaveType, fromDate, toDate, updateEmailBody]);

//   // Send email
//   const onSend = async () => {
//     setSending(true);

//     try {
//       await sendLeaveEmail({
//         from_email: user?.email ?? '',
//         to: toEmail,
//         cc: ccEmails,
//         subject,
//         body,
//       });
//       showToast('success', 'Leave request sent successfully!');

//       navigation.goBack();
//     } catch (err: any) {
//       showToast('error', err.message);
//     } finally {
//       setSending(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" />
//         <Text>Loading contacts...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={{ paddingBottom: 40 }}
//       showsVerticalScrollIndicator={false}
//     >
//       {/* Leave Type Dropdown */}
//       <Text style={styles.label}>Leave Type</Text>
//       <TouchableOpacity
//         style={styles.pickerBox}
//         onPress={() => setShowLeaveType(!showLeaveType)}
//       >
//         <Text>{leaveType}</Text>
//       </TouchableOpacity>

//       {showLeaveType && (
//         <View style={styles.dropdown}>
//           {[
//             'Sick Leave',
//             'Casual Leave',
//             'Emergency Leave',
//             'Vacation Leave',
//           ].map(type => (
//             <TouchableOpacity
//               key={type}
//               onPress={() => {
//                 setLeaveType(type);
//                 setShowLeaveType(false);
//                 setSubject(`${type} - ${user?.name}`);
//                 updateEmailBody();
//               }}
//               style={styles.dropdownItem}
//             >
//               <Text>{type}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}

//       {/* Date Picker - From */}
//       <Text style={styles.label}>From Date</Text>
//       <TouchableOpacity
//         style={styles.pickerBox}
//         onPress={() => setShowFromPicker(true)}
//       >
//         <Text>{fromDate.toDateString()}</Text>
//       </TouchableOpacity>
//       {showFromPicker && (
//         <DateTimePicker
//           value={fromDate}
//           mode="date"
//           display="default"
//           onChange={(e, d) => {
//             setShowFromPicker(false);
//             if (d) {
//               setFromDate(d);
//               updateEmailBody();
//             }
//           }}
//         />
//       )}

//       {/* Date Picker - To */}
//       <Text style={styles.label}>To Date</Text>
//       <TouchableOpacity
//         style={styles.pickerBox}
//         onPress={() => setShowToPicker(true)}
//       >
//         <Text>{toDate.toDateString()}</Text>
//       </TouchableOpacity>
//       {showToPicker && (
//         <DateTimePicker
//           value={toDate}
//           mode="date"
//           display="default"
//           onChange={(e, d) => {
//             setShowToPicker(false);
//             if (d) {
//               setToDate(d);
//               updateEmailBody();
//             }
//           }}
//         />
//       )}

//       {/* Auto-filled To */}
//       <Text style={styles.label}>To</Text>
//       <TextInput
//         style={styles.input}
//         value={toEmail}
//         onChangeText={setToEmail}
//       />

//       {/* CC */}
//       <Text style={styles.label}>CC</Text>
//       <TextInput
//         style={styles.input}
//         value={ccEmails.join(', ')}
//         onChangeText={txt =>
//           setCcEmails(
//             txt
//               .split(',')
//               .map(s => s.trim())
//               .filter(Boolean),
//           )
//         }
//       />

//       {/* Subject */}
//       <Text style={styles.label}>Subject</Text>
//       <TextInput
//         style={styles.input}
//         value={subject}
//         onChangeText={setSubject}
//       />

//       {/* Body */}
//       <Text style={styles.label}>Body</Text>
//       <TextInput
//         style={[styles.input, styles.bodyInput]}
//         multiline
//         value={body}
//         onChangeText={setBody}
//       />

//       <TouchableOpacity style={styles.btn} onPress={onSend} disabled={sending}>
//         <Text style={styles.btnText}>
//           {sending ? 'Sending...' : 'Send Leave Request'}
//         </Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }
