package io.spring.enrollmentsystem.feature.enrollment;

public enum WeekDay {
//    M, MT, MTW, MTWR, MTWRF, MTWRFS, MTWRFSU, MTWRFU, MTWRS, MTWRSU,
//    MTWRU, MTWF, MTWFS, MTWFSU, MTWFU, MTWS, MTWSU, MTWU, MTR, MTRF,
//    MTRFS, MTRFSU, MTRFU, MTRS, MTRSU, MTRU, MTF, MTFS, MTFSU, MTFU,
//    MTS, MTSU, MTU, MW, MWR, MWRF, MWRFS, MWRFSU, MWRFU, MWRS,
//    MWRSU, MWRU, MWF, MWFS, MWFSU, MWFU, MWS, MWSU, MWU, MR,
//    MRF, MRFS, MRFSU, MRFU, MRS, MRSU, MRU, MF, MFS, MFSU,
//    MFU, MS, MSU, MU, T, TW, TWR, TWRF, TWRFS, TWRFSU,
//    TWRFU, TWRS, TWRSU, TWRU, TWF, TWFS, TWFSU, TWFU, TWS, TWSU,
//    TWU, TR, TRF, TRFS, TRFSU, TRFU, TRS, TRSU, TRU, TF,
//    TFS, TFSU, TFU, TS, TSU, TU, W, WR, WRF, WRFS,
//    WRFSU, WRFU, WRS, WRSU, WRU, WF, WFS, WFSU, WFU, WS,
//    WSU, WU, R, RF, RFS, RFSU, RFU, RS, RSU, RU,
//    F, FS, FSU, FU, S, SU, U,

    M, T, W, R, F, MT, MTW, MTWR, MTWRF, MTWF, MTR, MTRF, MTF, MW,
    MWR, MWRF, MWF, MR, MRF, MF, TW, TWR, TWRF,
    TWF, TR, TRF, TF, WR, WRF, WF, RF;

    public String value() {
        StringBuilder stringBuilder = new StringBuilder();
        String[] arr = this.name().split("");
        for (String str : arr) {
            switch (str) {
                case "M":
                    stringBuilder.append("Mo");
                    break;
                case "T":
                    stringBuilder.append("Tu");
                    break;
                case "W":
                    stringBuilder.append("We");
                    break;
                case "R":
                    stringBuilder.append("Th");
                    break;
                case "F":
                    stringBuilder.append("Fr");
                    break;
                case "S":
                    stringBuilder.append("Sa");
                    break;
                case "U":
                    stringBuilder.append("Su");
                    break;
                default:
                    break;
            }
        }
        return stringBuilder.toString();
    }

    public String fullName() {
        StringBuilder stringBuilder = new StringBuilder();
        String[] arr = this.name().split("");
        for (int i = 0; i < arr.length; i++) {
            switch (arr[i]) {
                case "M":
                    stringBuilder.append("Monday");
                    break;
                case "T":
                    stringBuilder.append("Tuesday");
                    break;
                case "W":
                    stringBuilder.append("Wednesday");
                    break;
                case "R":
                    stringBuilder.append("Thursday");
                    break;
                case "F":
                    stringBuilder.append("Friday");
                    break;
                case "S":
                    stringBuilder.append("Saturday");
                    break;
                case "U":
                    stringBuilder.append("Sunday");
                    break;
                default:
                    break;
            }
            if (i < arr.length - 1) {
                stringBuilder.append(", ");
            }
        }
        return stringBuilder.toString();
    }
}
