import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth/session';
import { getAllMachineTypes } from '@/lib/cosmos/models/machine-type';
import * as XLSX from 'xlsx';

/**
 * GET /api/machine-types/export?format=csv|json|xlsx
 * Export all machine types as CSV, JSON, or Excel
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'csv';

    const machineTypes = await getAllMachineTypes();

    if (format === 'json') {
      // Export as JSON
      const date = new Date().toISOString().split('T')[0];
      return new NextResponse(JSON.stringify(machineTypes, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="machine-types-${date}.json"`,
        },
      });
    }

    if (format === 'xlsx') {
      // Export as true Excel file using xlsx library
      const date = new Date().toISOString().split('T')[0];
      const formatRotation = (val: number) => val === -1 ? '∞' : val;

      const data = machineTypes.map(mt => ({
        'ID': mt.id,
        'ID Type': mt.machineTypeId,
        'Nom du type': mt.machineTypeName,
        'Fabricant': mt.manufacturer,
        'Description': mt.description || '',
        'X (mm)': mt.x,
        'Y (mm)': mt.y,
        'Z (mm)': mt.z,
        'A (deg)': formatRotation(mt.a),
        'B (deg)': formatRotation(mt.b),
        'C (deg)': formatRotation(mt.c),
        'Créé le': mt.createdAt,
        'Créé par': mt.createdBy,
        'Modifié le': mt.updatedAt,
        'Modifié par': mt.updatedBy,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Types de machines');
      
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return new NextResponse(excelBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="machine-types-${date}.xlsx"`,
        },
      });
    }

    // Export as CSV (default)
    const csvHeaders = [
      'ID',
      'Machine Type ID',
      'Machine Type Name',
      'Manufacturer',
      'Description',
      'X (mm)',
      'Y (mm)',
      'Z (mm)',
      'A (deg)',
      'B (deg)',
      'C (deg)',
      'Created At',
      'Created By',
      'Updated At',
      'Updated By',
    ];

    const csvRows = machineTypes.map(mt => [
      mt.id,
      mt.machineTypeId,
      `"${mt.machineTypeName.replace(/"/g, '""')}"`, // Escape quotes
      `"${mt.manufacturer.replace(/"/g, '""')}"`,
      `"${(mt.description || '').replace(/"/g, '""')}"`,
      mt.x,
      mt.y,
      mt.z,
      mt.a,
      mt.b,
      mt.c,
      mt.createdAt,
      mt.createdBy,
      mt.updatedAt,
      mt.updatedBy,
    ]);

    const csv = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    const date = new Date().toISOString().split('T')[0];
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="machine-types-${date}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting machine types:', error);
    return NextResponse.json(
      { error: 'Failed to export machine types' },
      { status: 500 }
    );
  }
}
